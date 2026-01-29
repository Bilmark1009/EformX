<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Form;
use App\Models\Field;
use App\Models\Response;
use App\Models\ResponseValue;

class ProjectReviewSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@email.com')->first();

        if (!$user) {
            $this->command->error("User test@email.com not found!");
            return;
        }

        // Create the form
        $form = Form::create([
            'user_id' => $user->id,
            'title' => 'Project Satisfactory Review',
            'description' => 'Comprehensive evaluation of project delivery, quality, and client collaboration.',
            'status' => 'active',
        ]);

        $this->command->info("Form created: {$form->title}");

        // 10 Relevant Fields
        $fieldsData = [
            ['type' => 'short_text', 'label' => 'Project Name', 'required' => true],
            ['type' => 'short_text', 'label' => 'Client Representative', 'required' => true],
            ['type' => 'date', 'label' => 'Project Completion Date', 'required' => true],
            ['type' => 'dropdown', 'label' => 'Overall Satisfaction', 'required' => true, 'config' => ['options' => [['label' => 'Excellent', 'value' => 'excellent'], ['label' => 'Very Good', 'value' => 'very_good'], ['label' => 'Good', 'value' => 'good'], ['label' => 'Satisfactory', 'value' => 'satisfactory'], ['label' => 'Poor', 'value' => 'poor']]]],
            ['type' => 'dropdown', 'label' => 'Quality of Deliverables', 'required' => true, 'config' => ['options' => [['label' => 'Exceeded Expectations', 'value' => 'exceeded'], ['label' => 'Met All Requirements', 'value' => 'met'], ['label' => 'Minor Issues', 'value' => 'minor'], ['label' => 'Below Standards', 'value' => 'below']]]],
            ['type' => 'number', 'label' => 'Rating: Timeliness (1-10)', 'required' => true, 'config' => ['min' => 1, 'max' => 10]],
            ['type' => 'dropdown', 'label' => 'Communication Effectiveness', 'required' => true, 'config' => ['options' => [['label' => 'Proactive & Clear', 'value' => 'proactive'], ['label' => 'Consistent', 'value' => 'consistent'], ['label' => 'Occasional Delays', 'value' => 'delayed'], ['label' => 'Unresponsive', 'value' => 'unresponsive']]]],
            ['type' => 'checkbox', 'label' => 'Key Strengths Observed', 'required' => false, 'config' => ['options' => [['label' => 'Technical Expertise', 'value' => 'tech'], ['label' => 'Problem Solving', 'value' => 'solver'], ['label' => 'Creative Approach', 'value' => 'creative'], ['label' => 'Cost Efficiency', 'value' => 'cost']]]],
            ['type' => 'long_text', 'label' => 'Primary Areas for Improvement', 'required' => false],
            ['type' => 'dropdown', 'label' => 'Would you recommend us?', 'required' => true, 'config' => ['options' => [['label' => 'Definitely', 'value' => 'yes'], ['label' => 'Possibly', 'value' => 'maybe'], ['label' => 'Unlikely', 'value' => 'no']]]],
        ];

        $fields = [];
        foreach ($fieldsData as $index => $data) {
            $fields[] = Field::create(array_merge($data, [
                'form_id' => $form->id,
                'order' => $index + 1
            ]));
        }

        $this->command->info("10 fields initialized.");

        // Create 5 example responses
        for ($i = 0; $i < 5; $i++) {
            $response = Response::create([
                'form_id' => $form->id,
                'ip_address' => '192.168.1.1' . $i,
                'submitted_at' => now()->subDays(rand(0, 5)),
                'metadata' => ['browser' => 'System Insight Bot'],
            ]);

            foreach ($fields as $field) {
                $val = $this->mockValue($field);
                ResponseValue::create([
                    'response_id' => $response->id,
                    'field_id' => $field->id,
                    'value' => $val
                ]);
            }
        }

        $this->command->info("5 mock responses generated.");
    }

    private function mockValue($field)
    {
        switch ($field->type) {
            case 'short_text':
                return "Mock Project Delta " . rand(100, 999);
            case 'date':
                return now()->subDays(rand(10, 60))->format('Y-m-d');
            case 'number':
                return rand(7, 10);
            case 'textarea':
                return "The project was executed with precision, although integration Phase 2 could be optimized.";
            case 'dropdown':
                $opts = $field->config['options'];
                return $opts[array_rand($opts)]['value'];
            case 'checkbox':
                $opts = $field->config['options'];
                return json_encode([$opts[array_rand($opts)]['value']]);
            default:
                return "Confirmed.";
        }
    }
}
