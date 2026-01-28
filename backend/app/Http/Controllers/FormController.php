<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Form;
use Illuminate\Support\Facades\Auth;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $forms = Auth::user()->forms()
            ->withCount('responses')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($forms);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:draft,active,closed',
            'settings' => 'nullable|array',
        ]);

        $form = Auth::user()->forms()->create($validated);

        return response()->json($form, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Form $form)
    {
        if ($form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($form->load('fields'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Form $form)
    {
        if ($form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|string|in:draft,active,closed',
            'settings' => 'nullable|array',
        ]);

        $form->update($validated);

        return response()->json($form);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Form $form)
    {
        if ($form->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $form->delete();

        return response()->json(['message' => 'Form deleted successfully']);
    }
}
