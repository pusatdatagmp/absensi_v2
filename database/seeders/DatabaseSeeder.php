<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\KaryawanSeeder;
use Database\Seeders\AbsensiSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            [
                'email' => 'admin@gmail.com',
            ],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // $this->call([
        //     EmployeeSeeder::class,
        //     AttendanceSeeder::class,
        //     KaryawanSeeder::class,
        //     AbsensiSeeder::class,
        // ]);
    }
}
