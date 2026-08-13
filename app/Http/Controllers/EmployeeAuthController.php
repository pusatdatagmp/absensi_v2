<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class EmployeeAuthController extends Controller
{
    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'pin' => ['required'],
        ]);

        $user = User::where('email', $request->email)
            ->where('role', 'employee')
            ->first();

        if (!$user || !Hash::check($request->pin, $user->pin)) {
            return back()->withErrors([
                'pin' => 'PIN salah',
            ])->withInput();
        }

        Auth::login($user);

        return redirect()->route('employee.dashboard');
    }

    // LOGOUT
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/employee-login');
    }

    // ABSENSI
    public function attendance()
    {
        if (!Auth::check()) {
            return redirect('/');
        }

        Attendance::create([
            'user_id' => auth()->id(),
            'date' => now()->toDateString(),
            'check_in_time' => now()->toTimeString(),
        ]);

        return back()->with('success', 'Absensi berhasil');
    }
}
