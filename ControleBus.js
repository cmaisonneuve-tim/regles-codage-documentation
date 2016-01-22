#pragma strict
/**
 * Gestion des déplacements et des collisions du perssonge
 * par: Vahik
 * modifié: 5/12/2015
 */

var vitesseHorizonale: float = 1; //vietsse de déplacement horizontale du personnage
var vitesseVerticale: float = 4;  //vietsse de saut du personnage
var imgBusExplose: Sprite;        //image du bus explosé
var imgExplosion: Sprite;         //image de l'explosion
private var rigidbody2DBus: Rgidbody2D;

/**
 * Initialise la référence au composant Rgidbody2D du bus
 */
function Start()
{
  rigidbody2DBus = GetComponent(Rigidbody2D);
}

/**
 * Gère les déplacements du bus
 */
function Update()
{
  // déplacement horizontal si les touches "a" ou "d" sont appuyées
  if(Input.GetKey("a"))
  {
    rigidbody2DBus.velocity.x = -vitesseHorizonale;
  }
  else if(Input.GetKey("d"))
  {
    rigidbody2DBus.velocity.x = vitesseHorizonale;
  }
  // déplacement vértical si la touche "w" est appuyée
  if(Input.GetKeyDown("w"))
  {
    rigidbody2DBus.velocity.y = vitesseVerticale;
  }
}

/**
 * Détecte les collisions du personnage avec la bombe
 */
function OnCollisionEnter2D(infoObjetTouche : Collision2D)
{
  // si l'objet touché est la bombe
  if(infoObjetTouche.gameObject.name == "Bombe")
  {
    //fait exploser le bus
    ExploserBus(10);
  }
}

/**
 * Explose le bus: change l'image, applique une vitesse vers le haut et
 * une vitesse de rotation; fait apparaitre l'image de l'explosion.
 * 
 * @param {float} forceExplosion La force de l'explosion
 */
function ExploserBus(forceExplosion : float)
{
  GetComponent(SpriteRenderer).sprite = imgBusExplose;
  rigidbody2DBus.velocity.y = forceExplosion;
  rigidbody2DBus.angularVelocity= forceExplosion *10;
  
  infoObjetTouche.gameObject.GetComponent(SpriteRenderer).sprite = imgExplosion;
}
