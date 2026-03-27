package com.davidtaranto.enfoque;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Edge-to-Edge: el contenido web fluye debajo de status bar y navigation bar
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
  }
}
