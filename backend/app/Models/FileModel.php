<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileModel extends Model
{
    protected $table = 'files';

    protected $fillable = [
        'response_id',
        'field_id',
        'filename',
        'path',
        'size',
    ];

    public function response()
    {
        return $this->belongsTo(Response::class);
    }

    public function field()
    {
        return $this->belongsTo(Field::class);
    }
}
