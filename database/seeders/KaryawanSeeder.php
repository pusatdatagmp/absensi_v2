<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class KaryawanSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [
            ['nama' => 'Budi Santoso', 'jabatan' => 'IT Engineer'],
            ['nama' => 'Andi Pratama', 'jabatan' => 'Staff Gudang'],
            ['nama' => 'Siti Nurhaliza', 'jabatan' => 'Admin'],
            ['nama' => 'Rina Kurnia', 'jabatan' => 'HRD'],
            ['nama' => 'Dedi Saputra', 'jabatan' => 'Supervisor'],
        ];

        foreach ($employees as $index => $employee) {
            User::create([
                'name' => $employee['nama'],
                'email' => 'karyawan' . $index . '@demo.com',
                'password' => Hash::make('password'),
                'position' => $employee['jabatan'],
            ]);
        }
    }
}
