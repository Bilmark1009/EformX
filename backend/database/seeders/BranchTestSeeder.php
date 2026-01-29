<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Form;
use App\Models\Field;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BranchTestSeeder extends Seeder
{
    public function run(): void
    {
        // Create or update the test user with a reliable password
        $user = User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
            ]
        );

        // Define some form templates
        $forms = [
            [
                'title' => 'Customer Feedback Portal',
                'description' => 'Real-time telemetry from our core user base.',
                'status' => 'active',
            ],
            [
                'title' => 'Alpha Feature Request',
                'description' => 'Collecting requirement packets for next-gen deployment.',
                'status' => 'draft',
            ],
            [
                'title' => 'Event Registration (Q4)',
                'description' => 'Archived registration data from the last quarterly cycle.',
                'status' => 'closed',
            ],
        ];

        foreach ($forms as $formData) {
            $form = Form::create([
                'user_id' => $user->id,
                'title' => $formData['title'],
                'description' => $formData['description'],
                'status' => $formData['status'],
                'settings' => [
                    'success_message' => 'Transmission received. System integrity confirmed.',
                ]
            ]);

            // Add basic fields to each form
            Field::create([
                'form_id' => $form->id,
                'type' => 'short_text',
                'label' => 'Identity Signature',
                'order' => 0,
                'required' => true,
                'config' => ['placeholder' => 'Enter ID...']
            ]);

            Field::create([
                'form_id' => $form->id,
                'type' => 'long_text',
                'label' => 'Telemetry Data',
                'order' => 1,
                'required' => false,
                'config' => ['placeholder' => 'Awaiting input...']
            ]);
        }
    }
}
