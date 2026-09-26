<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Bersihkan duplikasi (user_id, date) lama akibat race condition
        // sebelum unique index dipasang. Baris terlama (id terkecil) yang
        // dipertahankan.
        $duplicates = DB::table('attendances')
            ->select('user_id', 'date')
            ->groupBy('user_id', 'date')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicates as $duplicate) {

            $ids = DB::table('attendances')
                ->where('user_id', $duplicate->user_id)
                ->where('date', $duplicate->date)
                ->orderBy('id')
                ->pluck('id');

            $ids->shift();

            if ($ids->isNotEmpty()) {
                DB::table('attendances')->whereIn('id', $ids)->delete();
            }
        }

        Schema::table('attendances', function (Blueprint $table) {
            $table->unique(['user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'date']);
        });
    }
};
