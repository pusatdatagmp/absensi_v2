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
        Schema::table('settings', function (Blueprint $table) {

            // Jam masuk resmi (baseline) untuk hitung Bonus/Ontime/Telat.
            // Terpisah dari check_in_start/check_in_end yang hanya menentukan
            // jendela kapan tombol absen boleh dipakai.
            $table->time('work_start_time')->nullable()->after('check_in_end');

            // Toleransi menit sebelum work_start_time untuk dapat predikat Bonus.
            $table->unsignedInteger('bonus_minutes')->default(15)->after('work_start_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['work_start_time', 'bonus_minutes']);
        });
    }
};
