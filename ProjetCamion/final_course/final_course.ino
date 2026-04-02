#include <Adafruit_NeoPixel.h>
#include <ChainableLED.h>

int val_y = 0;
int val_x = 0;
int val_light = 0;

const int X_Axe = A1;
const int Y_Axe = A2;
const int Light_sensor = A3;
const int tonePin = A4;

// --- Calibration ---
const float zeroX = 512;
const float zeroY = 512;
const float unitsPerG = 61.44;

// --- Seuil de freinage ---
const float freinageThresholdSTOP = -0.5;
const float freinageThresholdN = -0.7;
const float freinageThresholdP = 0.7;

float lastAccelX = 0;
float lastAccelY = 0;

const int LONG_PRESS_DELAY = 2000;

#define NUM_LEDS 2

ChainableLED leds(6, 7, NUM_LEDS);
Adafruit_NeoPixel pixels_arriere = Adafruit_NeoPixel(11, 5, NEO_GRB + NEO_KHZ800);

// -------------------------------------------------------

void setup() {
  Serial.begin(9600);
  Serial.println("=== SETUP DEBUT ===");

  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
  Serial.println("[SETUP] phares pins OK");

  pinMode(tonePin, OUTPUT);
  Serial.println("[SETUP] buzzer pin 11 OK");

  pixels_arriere.begin();
  pixels_arriere.show();
  Serial.println("[SETUP] pixels_arriere init OK");                                                                                                                                                                                                                   

  Serial.println("=== SETUP TERMINE ===");
  feu_croisement();
}

void plein_phare() {
  Serial.println("[PHARES] plein phare (255/255)");
  analogWrite(9, 255);
  analogWrite(10, 255);
  analogWrite(11, 255);
  leds.setColorRGB(0, 255, 255, 255);
  leds.setColorRGB(1, 255, 255, 255);
}

void feu_croisement() {
  Serial.println("[PHARES] feu de croisement (70/255)");
  analogWrite(9, 200);
  analogWrite(10, 200);
  analogWrite(11, 100);
  leds.setColorRGB(0, 100, 100, 100);
  leds.setColorRGB(1, 100, 100, 100);
}

void tick_clignotant() {
  Serial.println("[BUZZER] tick");
  tone(tonePin, 1000, 60);
  delay(80);
  noTone(tonePin);
  // pas de delay ici → absorbé par le delay(133) qui suit dans clignotant()
}

void tock_clignotant() {
  Serial.println("[BUZZER] tock");
  tone(tonePin, 800, 60);
  delay(80);
  noTone(tonePin);
  // pas de delay ici → absorbé par le delay(300) qui suit dans clignotant()
}

// -------------------------------------------------------

void clignotant(bool led) {
  Serial.print("[CLIGNOTANT] cote=");
  Serial.println(led == 0 ? "GAUCHE" : "DROIT");

  if (led == 0) {
    for (int t = 0; t < 3; t++) {
      Serial.print("[CLIGNOTANT] GAUCHE cycle ");
      Serial.println(t + 1);

      // --- ALLUMAGE + tick ---
      // Remorque gauche : LEDs 0→7, défilement du centre (7) vers l'extérieur (0)
      tick_clignotant();
      leds.setColorRGB(0, 255, 127, 0);
      pixels_arriere.setPixelColor(2, pixels_arriere.Color(255, 127, 0));
      pixels_arriere.show();  // centre
      delay(28);
      delay(34);
      pixels_arriere.setPixelColor(1, pixels_arriere.Color(255, 127, 0));
      pixels_arriere.show();
      delay(34);
      delay(60);
      pixels_arriere.setPixelColor(0, pixels_arriere.Color(255, 127, 0));
      pixels_arriere.show();  // extérieur
      delay(293);

      // --- EXTINCTION + tock ---
      tock_clignotant();
      pixels_arriere.setPixelColor(0, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.setPixelColor(1, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.setPixelColor(2, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.show();
      leds.setColorRGB(0, 0, 0, 0);
      delay(144);
    }

  } else {
    for (int t = 0; t < 3; t++) {
      Serial.print("[CLIGNOTANT] DROIT cycle ");
      Serial.println(t + 1);

      // --- ALLUMAGE + tick ---
      // Remorque droite : LEDs 8→15, défilement du centre (8) vers l'extérieur (15)
      tick_clignotant();
      leds.setColorRGB(led, 255, 127, 0);
      pixels_arriere.setPixelColor(8, pixels_arriere.Color(255, 127, 0));
      pixels_arriere.show();  // centre
      delay(28);;;
      delay(34);
      pixels_arriere.setPixelColor(9, pixels_arriere.Color(255, 127, 0));
      pixels_arriere.show();;;
      delay(34);;
      delay(60);
      pixels_arriere.setPixelColor(10, pixels_arriere.Color(255, 127, 0));
      pixels_arriere.show();;  // extérieur
      delay(293);

      // --- EXTINCTION + tock ---
      tock_clignotant();
      pixels_arriere.setPixelColor(8, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.setPixelColor(9, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.setPixelColor(10, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.show();
      leds.setColorRGB(1, 0, 0, 0);
      delay(176);
    }
  }
  noTone(tonePin);
  Serial.println("[CLIGNOTANT] fin");
}

// -------------------------------------------------------

int acc_Y() {
  int rawY = analogRead(Y_Axe);
  float aY = (rawY - zeroY) / unitsPerG;
  float d_g = aY + 4.31;
  lastAccelY = aY;
  delay(50);

  Serial.print("[ACC_Y] raw="); Serial.print(rawY);
  Serial.print(" aY=");         Serial.print(aY, 2);
  Serial.print("g  d_g=");      Serial.print(d_g, 2);

  if (d_g < freinageThresholdN)      { Serial.println(" -> GAUCHE (1)"); return 1; }
  else if (d_g > freinageThresholdP) { Serial.println(" -> DROIT (0)");  return 0; }
  else                               { Serial.println(" -> TOUT DROIT (2)"); return 2; }
}

bool acc_X() {
  int rawX = analogRead(X_Axe);
  float ax = (rawX - zeroX) / unitsPerG;
  float deltaX = ax - lastAccelX;
  lastAccelX = ax;
  delay(50);

  Serial.print("[ACC_X] raw=");    Serial.print(rawX);
  Serial.print(" ax=");            Serial.print(ax, 2);
  Serial.print("g  deltaX=");      Serial.print(deltaX, 2);

  if (deltaX < freinageThresholdSTOP) { Serial.println(" -> FREINAGE (1)"); return 1; }
  else                                { Serial.println(" -> normal (0)");    return 0; }
}

// -------------------------------------------------------

void allumer_feu_arriere() {
  Serial.println("[FEU_ARRIERE] allumage ROUGE vif");
  for (int i = 0; i < pixels_arriere.numPixels(); i++)
    {pixels_arriere.setPixelColor(i, pixels_arriere.Color(255, 0, 0));}
  pixels_arriere.show();
  delay(250);
}

void eteindre_feu_arriere() {
  Serial.println("[FEU_ARRIERE] extinction (rouge faible)");
  for (int i = 0; i < pixels_arriere.numPixels(); i++)
    {pixels_arriere.setPixelColor(i, pixels_arriere.Color(40, 0, 0));}
  pixels_arriere.show();
}

// -------------------------------------------------------

bool light() {
  val_light = analogRead(Light_sensor);
  bool nuit = (val_light < 300);
  Serial.print("[LIGHT] valeur="); Serial.print(val_light);
  Serial.println(nuit ? "  -> NUIT" : "  -> JOUR");
  return nuit;
}

// -------------------------------------------------------

void lumiere_tracteur() {
  Serial.println("--- lumiere_tracteur ---");

  int etatX = acc_X();
  int etatY = acc_Y();

  if (light() == 1) { plein_phare(); }
  else              { feu_croisement(); }

  if (etatX == 1) { allumer_feu_arriere(); }
  else            { eteindre_feu_arriere(); }

  if      (etatY == 0) { Serial.println("[LUMIERE] clignotant GAUCHE"); clignotant(0);     leds.setColorRGB(0, 160, 160, 160);}
  else if (etatY == 1) { Serial.println("[LUMIERE] clignotant DROIT");  clignotant(1); leds.setColorRGB(1, 160, 160, 160);}
  else                 { Serial.println("[LUMIERE] pas de clignotant"); }
}

// -------------------------------------------------------

void loop() {
  lumiere_tracteur();
  }
