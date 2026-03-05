<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Wedding Guest List</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; font-size: 12px; }
        h1 { color: #B59461; text-align: center; font-family: serif; margin-bottom: 5px; }
        h2 { border-bottom: 2px solid #B59461; padding-bottom: 5px; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f9f6f0; color: #B59461; font-weight: bold; }
        .attending-yes { color: green; font-weight: bold; }
        .attending-no { color: red; font-weight: bold; }
        .page-break { page-break-after: always; }
        .stats { text-align: right; font-size: 14px; font-weight: bold; color: #555; margin-bottom: 10px; }
    </style>
</head>
<body>

    <h1>Yasara & Anuruddha</h1>
    <h2>Bride's Side (Yasara)</h2>
    
    <div class="stats">
        Total Attending: {{ $yasaraGuests->where('attending', 'yes')->count() }}
    </div>

    <table>
        <thead>
            <tr>
                <th width="20%">Name</th>
                <th width="20%">Phone</th>
                <th width="15%">Attending</th>
                <th width="45%">Message</th>
            </tr>
        </thead>
        <tbody>
            @forelse($yasaraGuests as $guest)
                <tr>
                    <td>{{ $guest->name }}</td>
                    <td>{{ $guest->phone }}</td>
                    <td class="{{ $guest->attending === 'yes' ? 'attending-yes' : 'attending-no' }}">
                        {{ ucfirst($guest->attending) }}
                    </td>
                    <td>{{ $guest->message ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align: center;">No guests registered for this side yet.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="page-break"></div>

    <h1>Yasara & Anuruddha</h1>
    <h2>Groom's Side (Anuruddha)</h2>
    
    <div class="stats">
        Total Attending: {{ $anuruddhaGuests->where('attending', 'yes')->count() }}
    </div>

    <table>
        <thead>
            <tr>
                <th width="20%">Name</th>
                <th width="20%">Phone</th>
                <th width="15%">Attending</th>
                <th width="45%">Message</th>
            </tr>
        </thead>
        <tbody>
            @forelse($anuruddhaGuests as $guest)
                <tr>
                    <td>{{ $guest->name }}</td>
                    <td>{{ $guest->phone }}</td>
                    <td class="{{ $guest->attending === 'yes' ? 'attending-yes' : 'attending-no' }}">
                        {{ ucfirst($guest->attending) }}
                    </td>
                    <td>{{ $guest->message ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align: center;">No guests registered for this side yet.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>