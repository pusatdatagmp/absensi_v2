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
        $setting = DB::table('settings')->first();

        if ($setting) {

            $defaults = [
                'Telat 1' => $setting->late_level_1 ?? null,
                'Telat 2' => $setting->late_level_2 ?? null,
                'Telat 3' => $setting->late_level_3 ?? null,
            ];

            foreach ($defaults as $label => $minutes) {

                if (is_null($minutes)) {
                    continue;
                }

                DB::table('late_levels')->insertOrIgnore([
                    'label' => $label,
                    'minutes' => $minutes,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['late_level_1', 'late_level_2', 'late_level_3']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {

            $table->unsignedInteger('late_level_1')->default(10)->after('check_out');

            $table->unsignedInteger('late_level_2')->default(20)->after('late_level_1');

            $table->unsignedInteger('late_level_3')->default(60)->after('late_level_2');
        });
    }
};
