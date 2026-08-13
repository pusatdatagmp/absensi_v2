<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Database\Seeder;

class AbsensiSeeder extends Seeder
{
    public function run(): void
    {
        $today = now()->toDateString();

        Attendance::truncate();

        $users = User::all();

        $locations = [
            // 0 meter
            [
                'lat' => -7.551839831978322,
                'lng' => 112.23413246747968,
            ],

            // ±30 meter
            [
                'lat' => -7.551600,
                'lng' => 112.234132,
            ],

            // ±80 meter
            [
                'lat' => -7.551120,
                'lng' => 112.234132,
            ],

            // ±150 meter
            [
                'lat' => -7.550500,
                'lng' => 112.234132,
            ],

            // ±300 meter
            [
                'lat' => -7.549100,
                'lng' => 112.234132,
            ],
        ];

        foreach ($users as $index => $user) {

            $loc = $locations[$index % count($locations)];

            Attendance::create([
                'user_id' => $user->id,
                'date' => $today,
                'time' => now()->format('H:i:s'),
                'status' => 'hadir',
                'latitude' => $loc['lat'],
                'longitude' => $loc['lng'],
                'location' => "{$loc['lat']}, {$loc['lng']}",
            ]);
        }
    }
}
