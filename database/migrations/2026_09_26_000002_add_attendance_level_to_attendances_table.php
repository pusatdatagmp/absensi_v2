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
        Schema::table('attendances', function (Blueprint $table) {

            // Snapshot level kehadiran (Bonus/Ontime/Telat X/Setengah Hari)
            // pada saat check-in, supaya histori tidak ikut berubah kalau
            // admin mengubah baseline/late level di kemudian hari.
            $table->string('attendance_level')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn('attendance_level');
        });
    }
};
