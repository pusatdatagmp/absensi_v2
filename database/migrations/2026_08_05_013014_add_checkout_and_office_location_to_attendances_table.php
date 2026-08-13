<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {

            $table->foreignId('office_location_id')
                ->nullable()
                ->after('user_id')
                ->constrained()
                ->nullOnDelete();

            $table->time('check_out_time')->nullable()->after('status');

            $table->decimal('check_out_latitude', 10, 7)->nullable()->after('longitude');

            $table->decimal('check_out_longitude', 10, 7)->nullable()->after('check_out_latitude');

            $table->string('check_out_location')->nullable()->after('check_out_longitude');

            $table->decimal('check_out_distance', 8, 2)->nullable()->after('distance');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->renameColumn('time', 'check_in_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->renameColumn('check_in_time', 'time');
        });

        Schema::table('attendances', function (Blueprint $table) {

            $table->dropForeign(['office_location_id']);

            $table->dropColumn([
                'office_location_id',
                'check_out_time',
                'check_out_latitude',
                'check_out_longitude',
                'check_out_location',
                'check_out_distance',
            ]);
        });
    }
};
