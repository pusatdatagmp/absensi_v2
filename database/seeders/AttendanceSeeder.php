<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $employees = User::where('role', 'employee')->get();

        foreach ($employees as $index => $employee) {

            Attendance::create([
                'user_id' => $employee->id,

                'date' => now()->toDateString(),
                'check_in_time' => now()->subMinutes(rand(0, 60))->format('H:i:s'),

                'status' => 'hadir',

                'location' => 'Lokasi Testing',

                // sengaja jauh dari kantor
                'latitude' => -6.120000,
                'longitude' => 106.950000,

                'distance' => rand(150, 1200),

                // otomatis muncul di halaman approval
                'approval_status' => 'pending',

                'approved_by' => null,
                'approved_at' => null,
                'approval_note' => null,
            ]);
        }
    }
}
