<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Form;
use App\Models\Field;
use App\Models\Response as FormResponse;
use App\Models\ResponseValue;
use App\Models\FileModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PublicFormController extends Controller
{
    /**
     * Display the specified form structure for public submission.
     */
    public function show(Form $form)
    {
        if ($form->status !== 'active') {
            return response()->json(['message' => 'This form is not accepting submissions.'], 403);
        }

        return response()->json($form->load([
            'fields' => function ($query) {
                $query->orderBy('order');
            }
        ]));
    }

    /**
     * Store a newly created response in storage.
     */
    public function submit(Request $request, Form $form)
    {
        if ($form->status !== 'active') {
            return response()->json(['message' => 'This form is not accepting submissions.'], 403);
        }

        $fields = $form->fields;
        $rules = [];
        foreach ($fields as $field) {
            $rule = $field->required ? 'required' : 'nullable';

            if ($field->type === 'number') {
                $rule .= '|numeric';
            } elseif ($field->type === 'file') {
                $rule .= '|file';
                // Add more specific file validations from field config if needed
            }

            $rules["field_{$field->id}"] = $rule;
        }

        $validated = $request->validate($rules);

        $response = $form->responses()->create([
            'ip_address' => $request->ip(),
            'metadata' => [
                'user_agent' => $request->userAgent(),
            ],
            'submitted_at' => now(),
        ]);

        foreach ($fields as $field) {
            $valueKey = "field_{$field->id}";

            if ($field->type === 'file' && $request->hasFile($valueKey)) {
                $file = $request->file($valueKey);
                $path = $file->store("uploads/{$form->id}/{$response->id}", 'local');

                FileModel::create([
                    'response_id' => $response->id,
                    'field_id' => $field->id,
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                ]);
            } elseif ($request->has($valueKey)) {
                $value = $request->input($valueKey);

                if (is_array($value)) {
                    $value = json_encode($value);
                }

                ResponseValue::create([
                    'response_id' => $response->id,
                    'field_id' => $field->id,
                    'value' => (string) $value,
                ]);
            }
        }

        return response()->json([
            'message' => $form->settings['success_message'] ?? 'Response submitted successfully!',
            'response_id' => $response->id
        ], 201);
    }
}
