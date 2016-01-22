<?php  
/**
 * Modèle de base, étendu par héritage par tout autre modèle de l'application.
 * Cette classe sert de couche d'abstarction pour l'accès à MySQL avec la 
 * librairie standard MySQLi de PHP.
 */
class Modele {
	private $_sHote = "";
	private $_sUtilisateur = "";
	private $_sMdp = "";
	private $_sNomBd = "";	

	private $_nConnexion;
	private $_oResultat;

	/**
	 * Crée un modèle pour les requêtes MySQL.
	 *
	 * @param string $sHote Adresse URL de l'instance MySQL.
	 * @param string $sUtilisateur Nom d'utilisateur du compte MySQL.
	 * @param string $sMdp Mot de passe du compte MySQL.
	 * @param string $sNomBd Nom de la BD MySQL à utiliser.
	 */
	function __construct($sHote, $sUtilisateur, $sMdp, $sNomBd) {
		$this -> _sHote = $sHote;
		$this -> _sUtilisateur = $sUtilisateur;
		$this -> _sMdp = $sMdp;
		$this -> _sNomBd = $sNomBd;
	}	

	/** 
	 * Initialise et configure une connexion MySQL.
	 *
	 * @see http://php.net/manual/en/mysqli.construct.php Librairie MySQLi de PHP
	 * @see http://dev.mysql.com/doc/refman/5.7/en/charset-connection.html Documentation MySQL
	 */
	private function _ouvrir() {
		$this -> _nConnexion = new MySQLi($this -> _sHote, $this -> _sUtilisateur, $this -> _sMdp, $this -> _sNomBd);
		// La requête qui suit nous assure que le transfert de données entre MySQL
		// et PHP se fait toujours dans l'encodage approprié (UTF-8 ici).
		$this -> _nConnexion -> query("SET NAMES 'UTF8'");
	}

	/** 
	 * Ferme et libère une connexion MySQL.
	 */
	private function _fermer() {
		$this -> _nConnexion -> close();
	}

	/** 
	 * Assainit une valeur selon les règles de la connexion MySQL pour
	 * utilisation sécuritaire par concaténation dans les requêtes SQL.
	 *
	 * @param string $sValeur Valeur à assainir.
	 * @param bool $bEstNumerique Indique si la valeur est numérique ou pas.
	 * @return string|float La valeur assainit.
	 * @see http://ca3.php.net/manual/en/mysqli.real-escape-string.php.
	 */
	protected function assainir($sValeur, $bEstNumerique = false) {
		// Il faut traiter différement les valeurs numériques et textuelles
		if($bEstNumerique) {
			if(settype($sValeur, "float")) {
				return $sValeur;
			}
		}
		$this -> _ouvrir();
		return $this -> _nConnexion -> real_escape_string($sValeur);
	}

	/**
	 * Exécute une requête SQL sur la connexion BD et affecte la réponse
	 * dans la propriété resultat.
	 * 
	 * @param string $sRequete Requête SQL à exécuter.
	 */
	private function _executer($sRequete) {
		$this -> _ouvrir();
		$this -> _oResultat = $this -> _nConnexion -> query($sRequete);
	}

	/**
	 * Recherche des enregistrements dans une source de données
	 * et retourne un tableau PHP les contenants.
	 * 
	 * @param string $sRequete Requête SQL à exécuter.
	 * @return object[] Tableau d'objets PHP représentant les enregistrements trouvés.
	 */
	protected function lireEnrgs($sRequete) {
		$this -> _executer($sRequete);
		if($this -> _oResultat) {
			$aReponse = array();
			while ($enrg = $this -> _oResultat -> fetch_object()) {
				$aReponse[] = $enrg;
			}
			$this -> _fermer();
			return $aReponse;
		}
		else {
			return false;
		}
	}

	/**
	 * Insère un enregistrement dans la source de données
	 * et retourne son identifiant.
	 *  
	 * @param string $sRequete Requête SQL à exécuter.
	 * @return int|bool Identifiant auto-généré par MySQL de l'enregistrement 
	 * 				inséré ou false en cas d'erreur.
	 */
	protected function insererEnrg($sRequete) {
		$this -> _executer($sRequete);
		if($this -> _oResultat) {
			$nId = $this -> _nConnexion -> insert_id;
			$this -> _fermer();
			return $nId;
		}
		else {
			return false;
		}

	}

	/**
	 * Modifie un ou plusieurs enregistrements dans la source de données.
	 * 
	 * @param string $sRequete Requête SQL à exécuter.
	 * @return int|bool Nombre d'enregistrements affectés ou false en cas d'erreur.
	 */
	protected function modifierEnrgs($sRequete) {
		$this -> _executer($sRequete);
		if($this -> _oResultat) {
			$nNbEnrgsAffectes = $this -> _nConnexion -> affected_rows;
			$this -> _fermer();
			return $nNbEnrgsAffectes;
		}
		else {
			return false;
		}
	}

	/**
	 * Supprime un ou plusieurs enregistrements dans la source de données.
	 * Cette méthode appelle modifierEnrgs() avec le même argument : c'est donc
	 * un synonyme de cette dernière.
	 */
	protected function supprimerEnrgs($sRequete) {
		return $this -> modifierEnrgs($sRequete);
	}
}
?>
