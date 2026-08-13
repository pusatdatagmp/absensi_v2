<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            [
                'email' => 'employee@gmail.com',
            ],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'pin' => Hash::make('123456'),
                'role' => 'employee',
            ]
        );
    }
}
