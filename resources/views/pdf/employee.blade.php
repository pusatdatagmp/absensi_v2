<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <title>Absensi Karyawan</title>
    @if($month)
    <p>
        Periode:
        {{ \Carbon\Carbon::createFromFormat('Y-m', $month)->translatedFormat('F Y') }}
    </p>
    @endif

    <style>
        body {
            font-family: sans-serif;
            font-size: 14px;
        }

        h2 {
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #000000;
            padding: 10px;
            text-align: left;
        }

        th {
            background: #6f1f05;
            color: white;
            border: 1px solid #000000;

        }
    </style>
</head>

<body>

    <h2>Data Absensi Karyawan</h2>

    <table width="100%" style="margin-bottom:20px;">
        <tr>
            <td width="50%" valign="top">
                <p>
                    <strong>Nama:</strong>
                    {{ $employee->name }}
                </p>

                <p>
                    <strong>Email:</strong>
                    {{ $employee->email }}
                </p>
            </td>

            <td width="50%" valign="top">
                <p>
                    <strong>Total Hadir:</strong>
                    {{ $totalHadir }}
                </p>

                <p>
                    <strong>Total Izin:</strong>
                    {{ $totalIzin }}
                </p>

                <p>
                    <strong>Total Tidak Hadir:</strong>
                    {{ $totalTidakHadir }}
                </p>
            </td>
        </tr>
    </table>

    <table>

        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Level</th>
            </tr>
        </thead>

        <tbody>

            @foreach ($attendances as $index => $attendance)

            <tr>

                <td>
                    {{ $index + 1 }}
                </td>

                <td>
                    {{ \Carbon\Carbon::parse($attendance->date)->translatedFormat('d F Y') }}
                </td>

                <td>
                    {{ $attendance->check_in_time }}
                </td>

                <td>
                    {{ $attendance->check_out_time ?? '-' }}
                </td>

                <td>
                    {{ ucfirst($attendance->status) }}
                </td>


                <td>
                    {{ $attendance->attendance_level }}
                </td>

            </tr>

            @endforeach

        </tbody>

    </table>

</body>

</html>