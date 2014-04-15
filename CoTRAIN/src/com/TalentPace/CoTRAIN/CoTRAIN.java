/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.TalentPace.CoTRAIN;


import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.*;



public class CoTRAIN extends DroidGap
{
    @Override
//    public void onCreate(Bundle savedInstanceState)
//    {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.main);
//        super.setIntegerProperty("splashscreen", R.drawable.splash);
//        // Set by <content src="index.html" /> in config.xml
//        super.loadUrl(Config.getStartUrl(),5000);
//        appView.getSettings().setAllowUniversalAccessFromFileURLs(true);
////        
////        Bundle extras = getIntent().getExtras();
////        String message = extras.getString("url");
////        if(message == "notify"){
////            super.loadUrl("file:///android_asset/www/OneToOneChat.html", 5000);
////        }
////        else{
////        	//super.loadUrl(Config.getStartUrl(),5000);
////            super.loadUrl("file:///android_asset/www/index.html", 5000);
////        	//super.loadUrl("file:///android_asset/www/index.html")
////        }
//        
//    }
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.setIntegerProperty("loadUrlTimeoutValue", 10000); 

        Bundle extras = getIntent().getExtras();
        String message = extras.getString("url");
        Log.d(TAG, "message - notify: " + message);
        super.loadUrl("file:///android_asset/www/index.html", 5000);
      
    }
}

