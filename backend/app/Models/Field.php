<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    protected $fillable = [
        'form_id',
        'type',
        'label',
        'config',
        'order',
        'required',
    ];

    protected $casts = [
        'config' => 'array',
        'required' => 'boolean',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class);
    }

    public function values()
    {
        return $this->hasMany(ResponseValue::class);
    }
}
