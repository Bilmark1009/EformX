<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Form;
use App\Models\Field;
use Illuminate\Database\Seeder;

class FormSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure we have a user
        $user = User::first() ?? User::factory()->create([
            'name' => 'Demo Admin',
            'email' => 'admin@formbuilder.test',
            'password' => bcrypt('password123'),
        ]);

        // Create a test form
        $form = Form::create([
            'user_id' => $user->id,
            'title' => 'Product Feedback Survey',
            'description' => 'We value your opinion! Please let us know how we can improve our services.',
            'status' => 'active',
            'settings' => [
                'success_message' => 'Thank you for your valuable feedback!',
                'allow_anonymous' => true,
            ],
        ]);

        // Add fields
        $fields = [
            [
                'type' => 'short_text',
                'label' => 'Full Name',
                'order' => 0,
                'required' => true,
                'config' => ['placeholder' => 'Enter your name...']
            ],
            [
                'type' => 'dropdown',
                'label' => 'How did you hear about us?',
                'order' => 1,
                'required' => false,
                'config' => [
                    'options' => [
                        ['label' => 'Social Media', 'value' => 'social_media'],
                        ['label' => 'Friend/Referral', 'value' => 'referral'],
                        ['label' => 'Search Engine', 'value' => 'search'],
                        ['label' => 'Other', 'value' => 'other'],
                    ]
                ]
            ],
            [
                'type' => 'number',
                'label' => 'On a scale of 1-10, how likely are you to recommend us?',
                'order' => 2,
                'required' => true,
                'config' => ['min' => 1, 'max' => 10]
            ],
            [
                'type' => 'long_text',
                'label' => 'What features would you like to see next?',
                'order' => 3,
                'required' => false,
                'config' => ['placeholder' => 'Tell us more...']
            ],
            [
                'type' => 'file',
                'label' => 'Upload a screenshot of any issue (optional)',
                'order' => 4,
                'required' => false,
                'config' => ['helpText' => 'Max 5MB. PNG or JPG preferred.']
            ],
            [
                'type' => 'checkbox',
                'label' => 'Which services do you use?',
                'order' => 5,
                'required' => false,
                'config' => [
                    'options' => [
                        ['label' => 'Cloud Hosting', 'value' => 'cloud'],
                        ['label' => 'Domain Name', 'value' => 'domain'],
                        ['label' => 'SSL Certificate', 'value' => 'ssl'],
                        ['label' => 'Email Marketing', 'value' => 'email'],
                    ]
                ]
            ],
        ];

        foreach ($fields as $fieldData) {
            Field::create(array_merge($fieldData, ['form_id' => $form->id]));
        }
    }
}
