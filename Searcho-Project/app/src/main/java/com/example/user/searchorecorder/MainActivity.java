package com.example.user.searchorecorder;

import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.AsyncTask;
import android.os.Environment;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;


public class MainActivity extends AppCompatActivity {

    private Button play,stop;
    private MediaRecorder myAudioRecorder;
    private String outputFile;
    private ImageButton record;

    final String url = "http://192.168.0.60:3000/audio";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        play = (Button)findViewById(R.id.play);
        stop = (Button)findViewById(R.id.stop);
        record = (ImageButton)findViewById(R.id.record);
        stop.setEnabled(true);
        play.setEnabled(true);

        final RequestQueue queue = Volley.newRequestQueue(this);

        outputFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/recording.3gp";

        //when record button is pressed, the process starts a new
        //media recorder object and records the person's order's.
        record.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    myAudioRecorder = new MediaRecorder();
                    myAudioRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                    myAudioRecorder.setOutputFormat(MediaRecorder.OutputFormat.AMR_WB);
                    myAudioRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_WB);
                    myAudioRecorder.setOutputFile(outputFile);

                    myAudioRecorder.prepare();
                    myAudioRecorder.start();
                } catch (IOException ioe) {
                    //make something
                }

                record.setEnabled(false);
                stop.setEnabled(true);

                Toast.makeText(getApplicationContext(), "Recording started", Toast.LENGTH_LONG).show();
            }
        });

        //When stop buttons is pressed, the process sends
        //the record to the server for speech to text process.
        stop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                myAudioRecorder.stop();
                myAudioRecorder.release();
                myAudioRecorder = null;
                record.setEnabled(true);
                stop.setEnabled(false);
                play.setEnabled(true);
                Toast.makeText(getApplicationContext(), "Audio Recorder Successfully", Toast.LENGTH_LONG).show();

                //this is a thread for sending the message to the
                //server. we open the file with his path and
                //we read the bits of the file and sending them
                //in json object request.
                //that is more comfortable for the server to open the request.
                new Thread(new Runnable() {
                    public void run() {
                        File file = new File(outputFile);
                        int size = (int) file.length();
                        byte[] bytes = new byte[size];
                        try {
                            queue.start();
                            //read the bytes from the file to the bytes object
                            BufferedInputStream buf = new BufferedInputStream(new FileInputStream(file));
                            buf.read(bytes, 0, bytes.length);
                            buf.close();

                            //decode the bytes
                            String base64 = Base64.encodeToString(bytes, Base64.DEFAULT);

                            System.out.println("Finish writing the file");

                            HashMap<String,String> params = new HashMap<String,String>();
                            params.put("data", base64);

                            System.out.println(base64);

                            System.out.println("Entered the file to params");

                            //this is the json object request for sending
                            //the answer to the server.
                            JsonObjectRequest jsObjRequest = new
                                    JsonObjectRequest(Request.Method.POST,
                                    url,
                                    new JSONObject(params),
                                    new Response.Listener<JSONObject>() {
                                        @Override
                                        public void onResponse(JSONObject response) {

                                        }
                                    }, new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    System.out.println("Error Getting 500");
                                }
                            });
                            queue.add(jsObjRequest);

                        } catch (FileNotFoundException e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
                        } catch (IOException e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
                        }

                    }
                }).start();
            }
        });

        //play buttons is for playing the audio file and checking
        //your request
        play.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v){
                MediaPlayer mediaPlayer = new MediaPlayer();

                try{
                    mediaPlayer.setDataSource(outputFile);
                    mediaPlayer.prepare();
                    mediaPlayer.start();

                    Toast.makeText(getApplicationContext(), "Playing Audio", Toast.LENGTH_LONG).show();
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        });
    }
}
