<?php

// app/Services/FirebaseService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FirebaseService
{
    protected $baseUrl;
    protected $collection;

    public function __construct()
    {
        $projectId = env('FIREBASE_PROJECT_ID'); // isi di .env
        $this->baseUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents";
        $this->collection = 'Users';
    }

    public function findByEmail($email)
    {
    $all = $this->getAll();

    if (!isset($all['documents'])) return null;

    foreach ($all['documents'] as $doc) {
        $fields = $doc['fields'];
        if ($fields['email']['stringValue'] === $email) {
            $id = basename($doc['name']);
            return ['id' => $id, 'fields' => $fields];
        }
    }

    return null;
    }

    public function findByUsername($username)
    {
        $all = $this->getAll();

        if (!isset($all['documents'])) return null;

        foreach ($all['documents'] as $doc) {
            $fields = $doc['fields'];
            if (isset($fields['username']) && $fields['username']['stringValue'] === $username) {
                $id = basename($doc['name']);
                return ['id' => $id, 'fields' => $fields];
            }
        }

        return null;
    }



    public function getAll()
    {
        $url = "{$this->baseUrl}/{$this->collection}";
        $response = Http::get($url);
        return $response->json();
    }

    public function create(array $data)
    {
        $url = "{$this->baseUrl}/{$this->collection}";
        $body = [
            'fields' => $this->formatData($data)
        ];
        $response = Http::post($url, $body);
        return $response->json();
    }

    
    public function get($id)
    {
        $url = "{$this->baseUrl}/{$this->collection}/{$id}";
        $response = Http::get($url);
        return $response->json();
    }

    public function update($id, array $data)
    {
        $url = "{$this->baseUrl}/{$this->collection}/{$id}?updateMask.fieldPaths=" . implode("&updateMask.fieldPaths=", array_keys($data));
        $body = ['fields' => $this->formatData($data)];
        $response = Http::patch($url, $body);
        return $response->json();
    }

    public function delete($id)
    {
        $url = "{$this->baseUrl}/{$this->collection}/{$id}";
        return Http::delete($url);
    }

    protected function formatData(array $data)
    {
        $formatted = [];
        foreach ($data as $key => $value) {
            $formatted[$key] = is_numeric($value)
                ? ['integerValue' => $value]
                : ['stringValue' => $value];
        }
        return $formatted;
    }
}
