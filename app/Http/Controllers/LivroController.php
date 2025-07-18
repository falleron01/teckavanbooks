<?php

namespace App\Http\Controllers;

use App\Models\Livro;
use Illuminate\Http\Request;

class LivroController extends Controller
{
    public function index()
    {
        return Livro::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:80',
            'autor' => 'required|string|max:80',
            'ano_publi' => 'required|integer|min:1000',
            'genero' => 'required|string|max:100',
            'qt_estoque' => 'required|integer|min:0',
        ]);

        $livro = Livro::create($validated);
        return response()->json($livro,201);
    }

    public function show($id)
    {
        return Livro::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $livro = Livro::findOrFail($id);

        $validated = $request->validate([
            'titulo' => 'required|string|max:80',
            'autor' => 'required|string|max:80',
            'ano_publi' => 'required|integer|min:1000',
            'genero' => 'required|string|max:100',
            'qt_estoque' => 'required|integer|min:0'
        ]);

        $livro->update($validated);
        return response()->json($livro);
    }

    public function destroy($id)
    {
        $livro = Livro::find($id);

        if ($livro){
            $livro->delete();
            return response()->json([],200);
        }
        
        return response()->json(['message' => 'Livro não encontrado.', 404]);
    }
}