<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {

            $table->id();

            $table->string('company_name')->default('PT Contoh');

            $table->string('office_name')->nullable();

            $table->decimal('office_latitude', 10, 7);

            $table->decimal('office_longitude', 10, 7);

            $table->integer('attendance_radius')->default(100);

            $table->time('check_in_start')->nullable();

            $table->time('check_in_end')->nullable();

            $table->time('check_out')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
