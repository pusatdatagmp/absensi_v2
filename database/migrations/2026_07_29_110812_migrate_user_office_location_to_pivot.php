<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        $users = DB::table('users')
            ->whereNotNull('office_location_id')
            ->get();

        foreach ($users as $user) {
            DB::table('office_location_user')->insert([
                'user_id' => $user->id,
                'office_location_id' => $user->office_location_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('office_location_user')->truncate();
    }
};
