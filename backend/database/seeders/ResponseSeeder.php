<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Form;
use App\Models\Response;
use App\Models\ResponseValue;
use App\Models\Field;
use Illuminate\Support\Str;

class ResponseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@email.com')->first();

        if (!$user) {
            $this->command->error("User test@email.com not found!");
            return;
        }

        $forms = Form::where('user_id', $user->id)->get();

        if ($forms->isEmpty()) {
            $this->command->warn("No forms found for test@email.com");
            return;
        }

        foreach ($forms as $form) {
            $this->command->info("Seeding responses for form: {$form->title}");

            for ($i = 0; $i < 5; $i++) {
                $response = Response::create([
                    'form_id' => $form->id,
                    'ip_address' => '127.0.0.1',
                    'submitted_at' => now()->subDays(rand(0, 13))->subHours(rand(0, 23)),
                    'metadata' => ['device' => 'System Seeder'],
                ]);

                foreach ($form->fields as $field) {
                    $value = $this->generateValue($field);
                    ResponseValue::create([
                        'response_id' => $response->id,
                        'field_id' => $field->id,
                        'value' => $value,
                    ]);
                }
            }
        }
    }

    private function generateValue(Field $field)
    {
        switch ($field->type) {
            case 'text':
                return "Sample data for {$field->label}";
            case 'textarea':
                return "Extended telemetry data for module {$field->label}. Signal strength nominal.";
            case 'number':
                return rand(1, 100);
            case 'email':
                return Str::random(8) . "@telemetry.sys";
            case 'select':
            case 'radio':
                $options = $field->config['options'] ?? ['Option A', 'Option B'];
                return $options[array_rand($options)];
            case 'checkbox':
                $options = $field->config['options'] ?? ['Opt 1', 'Opt 2'];
                return json_encode([$options[array_rand($options)]]);
            case 'date':
                return now()->subDays(rand(0, 30))->format('Y-m-d');
            default:
                return "Signal received " . Str::random(5);
        }
    }
}
