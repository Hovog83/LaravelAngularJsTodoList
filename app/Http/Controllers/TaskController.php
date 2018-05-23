<?php

namespace App\Http\Controllers;

use App\Task;
use Illuminate\Http\Request;
use App\User;
use Auth;
use Validator;
use JWTAuth;

class TaskController extends Controller
{
    public function __construct()
    {
        // All route requests must pass authentication except authenticate.
        $this->middleware('jwt.auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        return Task::where('user_id', Auth::user()->id)->get()->groupBy('completed');
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
                'title' => 'required',
             ]);
         if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 412);
         }
         $task = new Task($request->all());
         $task->save();
         return $task;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        return $task;
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Task $task)
    {
        $task->completed = $request->completed;
        $task->save();
        return $task;
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return [
            'deleted' => true
        ];
    }
}
