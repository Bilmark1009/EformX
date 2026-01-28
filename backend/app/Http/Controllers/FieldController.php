<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Field;
use App\Models\Form;
use Illuminate\Support\Facades\Auth;

class FieldController extends Controller
{
    public function index(Form $form)
    {
        if ($form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($form->fields);
    }

    public function store(Request $request, Form $form)
    {
        if ($form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type' => 'required|string|in:short_text,long_text,number,dropdown,checkbox,file',
            'label' => 'required|string|max:255',
            'config' => 'nullable|array',
            'order' => 'nullable|integer',
            'required' => 'nullable|boolean',
        ]);

        $field = $form->fields()->create($validated);

        return response()->json($field, 201);
    }

    public function update(Request $request, Field $field)
    {
        if ($field->form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type' => 'sometimes|required|string|in:short_text,long_text,number,dropdown,checkbox,file',
            'label' => 'sometimes|required|string|max:255',
            'config' => 'nullable|array',
            'order' => 'nullable|integer',
            'required' => 'nullable|boolean',
        ]);

        $field->update($validated);

        return response()->json($field);
    }

    public function destroy(Field $field)
    {
        if ($field->form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $field->delete();

        return response()->json(['message' => 'Field deleted successfully']);
    }

    public function reorder(Request $request, Form $form)
    {
        if ($form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'fields' => 'required|array',
            'fields.*.id' => 'required|exists:fields,id',
            'fields.*.order' => 'required|integer',
        ]);

        foreach ($request->fields as $fieldData) {
            Field::where('id', $fieldData['id'])
                ->where('form_id', $form->id)
                ->update(['order' => $fieldData['order']]);
        }

        return response()->json(['message' => 'Fields reordered successfully']);
    }
}
