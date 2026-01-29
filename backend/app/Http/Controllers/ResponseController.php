<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Form;
use App\Models\Response as FormResponse;
use Illuminate\Support\Facades\Auth;

class ResponseController extends Controller
{
    public function index(Request $request, ?Form $form = null)
    {
        if ($form && $form->exists) {
            if ($form->user_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            $query = $form->responses();
        } else {
            $query = FormResponse::whereHas('form', function ($q) {
                $q->where('user_id', Auth::id());
            });

            if ($request->has('form_id') && $request->form_id) {
                $query->where('form_id', $request->form_id);
            }
        }

        $responses = $query->with(['form', 'values.field', 'files'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($responses);
    }

    public function show(FormResponse $response)
    {
        if ($response->form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($response->load(['values.field', 'files']));
    }

    public function destroy(FormResponse $response)
    {
        if ($response->form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $response->delete();

        return response()->json(['message' => 'Response deleted successfully']);
    }

    public function export(Form $form)
    {
        if ($form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $responses = $form->responses()->with(['values.field'])->get();
        $fields = $form->fields()->orderBy('order')->get();

        $headers = ['Response ID', 'Submitted At', 'IP Address'];
        foreach ($fields as $field) {
            $headers[] = $field->label;
        }

        $callback = function () use ($responses, $fields, $headers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);

            foreach ($responses as $response) {
                $row = [
                    $response->id,
                    $response->created_at,
                    $response->ip_address,
                ];

                foreach ($fields as $field) {
                    $value = $response->values->firstWhere('field_id', $field->id);
                    $row[] = $value ? $value->value : '';
                }

                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=responses_{$form->id}.csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ]);
    }

    public function stats(Form $form)
    {
        if ($form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get count of responses per day for the last 14 days
        $stats = $form->responses()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(14))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        // Fill in missing days with 0
        $data = [];
        for ($i = 13; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $stat = $stats->firstWhere('date', $date);
            $data[] = [
                'date' => $date,
                'count' => $stat ? $stat->count : 0,
                'label' => now()->subDays($i)->format('D d'),
            ];
        }

        return response()->json($data);
    }
}
