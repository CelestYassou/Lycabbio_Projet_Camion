#include <Adafruit_NeoPixel.h>
#include <ChainableLED.h>

int val_y = 0;
int val_x = 0;
int val_light = 0;

const int pin_button = 8;
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
Adafruit_NeoPixel remorque = Adafruit_NeoPixel(16, 3, NEO_GRB + NEO_KHZ800);

// -------------------------------------------------------

void setup() {
  Serial.begin(9600);
  Serial.println("=== SETUP DEBUT ===");

  remorque.begin();
  remorque.show();
  Serial.println("[SETUP] remorque init OK");

  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
  Serial.println("[SETUP] phares pins OK");

  pinMode(pin_button, INPUT_PULLUP);
  Serial.println("[SETUP] bouton pin 8 INPUT_PULLUP OK");

  pinMode(tonePin, OUTPUT);
  Serial.println("[SETUP] buzzer pin 11 OK");

  pixels_arriere.begin();
  pixels_arriere.show();
  Serial.println("[SETUP] pixels_arriere init OK");                                                                                                                                                                                                                   

  Serial.println("=== SETUP TERMINE ===");
  feu_croisement();
}

// -------------------------------------------------------

int lire_bouton() {
  if (digitalRead(pin_button) == LOW) return 0;

  Serial.println("[BOUTON] appui detecte, attente relachement...");
  unsigned long debut = millis();

  while (digitalRead(pin_button) == HIGH) {
    delay(10);
  }

  unsigned long duree = millis() - debut;
  Serial.print("[BOUTON] duree = ");
  Serial.print(duree);
  Serial.println("ms");

  if (duree >= LONG_PRESS_DELAY) {
    Serial.println("[BOUTON] -> LONG (disco)");
    return 2;
  } else {
    Serial.println("[BOUTON] -> COURT (appel phare)");
    return 1;
  }
}

// -------------------------------------------------------

void appel_de_phare() {
  Serial.println("[APPEL_PHARE] debut");
  feu_croisement();
  delay(500);
  plein_phare();
  delay(250);
  feu_croisement();
  Serial.println("[APPEL_PHARE] fin");
}

// -------------------------------------------------------

// Convertit HSB (0.0-1.0) en couleur NeoPixel uint32_t
uint32_t hsbToColor(Adafruit_NeoPixel& strip, float h, float s, float b) {
  float r, g, bl;
  int i = (int)(h * 6);
  float f = h * 6 - i;
  float p = b * (1 - s);
  float q = b * (1 - f * s);
  float t = b * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = b; g = t; bl = p; break;
    case 1: r = q; g = b; bl = p; break;
    case 2: r = p; g = b; bl = t; break;
    case 3: r = p; g = q; bl = b; break;
    case 4: r = t; g = p; bl = b; break;
    case 5: r = b; g = p; bl = q; break;
  }
  return strip.Color((int)(r * 255), (int)(g * 255), (int)(bl * 255));
}

void disco_mode(int time) {
  float hue = 0.0;
  bool up = true;
  unsigned long start = millis();

  while (millis() - start < time) {

    // --- ChainableLED ---
    for (byte i = 0; i < NUM_LEDS; i++)
      leds.setColorHSB(i, hue, 1.0, 0.5);  // garde la fonction native

    // --- pixels_arriere (11 LEDs) ---
    uint32_t couleur_arriere = hsbToColor(pixels_arriere, hue, 1.0, 0.5);
    for (int i = 0; i < pixels_arriere.numPixels(); i++)
      pixels_arriere.setPixelColor(i, couleur_arriere);
    pixels_arriere.show();

    // --- remorque (16 LEDs) ---
    uint32_t couleur_remorque = hsbToColor(remorque, hue, 1.0, 0.5);
    for (int i = 0; i < remorque.numPixels(); i++)
      remorque.setPixelColor(i, couleur_remorque);
    remorque.show();

    delay(50);

    // --- mise à jour hue ---
    if (up)  hue += 0.025;
    else     hue -= 0.025;

    if      (hue >= 1.0 && up)  up = false;
    else if (hue <= 0.0 && !up) up = true;
  }
}

void disco_modeBIS(int time) {
  Serial.print("[DISCO] debut, duree=");
  Serial.print(time);
  Serial.println("ms");

  int red = 0, green = 0, blue = 0;
  bool red_up = true, green_up = true, blue_up = true;
  unsigned long start = millis();
  int frame = 0;

  while (millis() - start < time) {
    if (frame % 10 == 0) {
      Serial.print("[DISCO] frame="); Serial.print(frame);
      Serial.print(" R="); Serial.print(red);
      Serial.print(" G="); Serial.print(green);
      Serial.print(" B="); Serial.println(blue);
    }
    frame++;

    for (uint16_t i = 0; i < remorque.numPixels(); i++)
      remorque.setPixelColor(i, remorque.Color(red, green, blue));
    remorque.show();

    for (uint16_t i = 0; i < pixels_arriere.numPixels(); i++)
      pixels_arriere.setPixelColor(i, pixels_arriere.Color(red, green, blue));
    pixels_arriere.show();

    for (uint16_t i = 0; i < NUM_LEDS; i++)
      leds.setColorRGB(i, red, green, blue);

    delay(50);

    if (red_up)   { red   += 5; if (red   >= 255) red_up   = false; }
    else          { red   -= 5; if (red   <= 0)   red_up   = true;  }
    if (green_up) { green += 7; if (green >= 255) green_up = false; }
    else          { green -= 7; if (green <= 0)   green_up = true;  }
    if (blue_up)  { blue  += 3; if (blue  >= 255) blue_up  = false; }
    else          { blue  -= 3; if (blue  <= 0)   blue_up  = true;  }
  }
  Serial.println("[DISCO] fin");
}

// -------------------------------------------------------

void feu_croisement() {
  Serial.println("[PHARES] feu de croisement (70/255)");
  analogWrite(9, 200);
  analogWrite(10, 200);
  analogWrite(11, 100);
  leds.setColorRGB(0, 100, 100, 100);
  leds.setColorRGB(1, 100, 100, 100);
}

void plein_phare() {
  Serial.println("[PHARES] plein phare (255/255)");
  analogWrite(9, 255);
  analogWrite(10, 255);
  analogWrite(11, 255);
  leds.setColorRGB(0, 255, 255, 255);
  leds.setColorRGB(1, 255, 255, 255);
}

// -------------------------------------------------------
// "Tick" au allumage, "Tock" à l'extinction — synchronisé avec les LEDs
// -------------------------------------------------------

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
      pixels_arriere.show();
      remorque.setPixelColor(7, remorque.Color(255, 127, 0));  // centre
      remorque.setPixelColor(6, remorque.Color(255, 127, 0));
      remorque.show();
      delay(28);
      remorque.setPixelColor(5, remorque.Color(255, 127, 0));
      remorque.setPixelColor(4, remorque.Color(255, 127, 0));
      remorque.show();
      delay(34);
      pixels_arriere.setPixelColor(1, pixels_arriere.Color(255, 127, 0));
      pixels_arriere.show();
      remorque.setPixelColor(3, remorque.Color(255, 127, 0));
      remorque.setPixelColor(2, remorque.Color(255, 127, 0));
      remorque.show();
      delay(34);
      remorque.setPixelColor(1, remorque.Color(255, 127, 0));
      remorque.show();
      delay(60);
      pixels_arriere.setPixelColor(0, pixels_arriere.Color(255, 127, 0));
      pixels_arriere.show();
      remorque.setPixelColor(0, remorque.Color(255, 127, 0));  // extérieur
      remorque.show();
      delay(293);

      // --- EXTINCTION + tock ---
      tock_clignotant();
      pixels_arriere.setPixelColor(0, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.setPixelColor(1, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.setPixelColor(2, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.show();
      for (int i = 0; i < 8; i++)
        remorque.setPixelColor(i, remorque.Color(40, 0, 0));
      remorque.show();
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
      pixels_arriere.show();
      remorque.setPixelColor(8, remorque.Color(255, 127, 0));  // centre
      remorque.setPixelColor(9, remorque.Color(255, 127, 0));
      remorque.show();
      delay(28);
      remorque.setPixelColor(10, remorque.Color(255, 127, 0));
      remorque.setPixelColor(11, remorque.Color(255, 127, 0));
      remorque.show();
      delay(34);
      pixels_arriere.setPixelColor(9, pixels_arriere.Color(255, 127, 0));
      pixels_arriere.show();
      remorque.setPixelColor(12, remorque.Color(255, 127, 0));
      remorque.setPixelColor(13, remorque.Color(255, 127, 0));
      remorque.show();
      delay(34);
      remorque.setPixelColor(14, remorque.Color(255, 127, 0));
      remorque.show();
      delay(60);
      pixels_arriere.setPixelColor(10, pixels_arriere.Color(255, 127, 0));
      pixels_arriere.show();
      remorque.setPixelColor(15, remorque.Color(255, 127, 0));  // extérieur
      remorque.show();
      delay(293);

      // --- EXTINCTION + tock ---
      tock_clignotant();
      pixels_arriere.setPixelColor(8, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.setPixelColor(9, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.setPixelColor(10, pixels_arriere.Color(40, 0, 0));
      pixels_arriere.show();
      for (int i = 8; i < 16; i++)
        {remorque.setPixelColor(i, remorque.Color(40, 0, 0));}
      remorque.show();
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
  for (int i = 0; i < remorque.numPixels(); i++)
    {remorque.setPixelColor(i, remorque.Color(255, 0, 0));}
  remorque.show();
  delay(250);
}

void eteindre_feu_arriere() {
  Serial.println("[FEU_ARRIERE] extinction (rouge faible)");
  for (int i = 0; i < pixels_arriere.numPixels(); i++)
    pixels_arriere.setPixelColor(i, pixels_arriere.Color(40, 0, 0));
  pixels_arriere.show();
  for (int i = 0; i < remorque.numPixels(); i++)
    remorque.setPixelColor(i, remorque.Color(40, 0, 0));
  remorque.show();
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
  int appui = lire_bouton();

  if (appui == 1) {
    Serial.println("[LUMIERE] -> appel_de_phare()");
    appel_de_phare();
  } else if (appui == 2) {
    Serial.println("[LUMIERE] -> disco_mode()");
    disco_mode(5000);
    leds.setColorRGB(0, 160, 160, 160);
    leds.setColorRGB(1, 160, 160, 160);
  } else {
    Serial.println("[LUMIERE] bouton = pas d'appui");
  }

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
