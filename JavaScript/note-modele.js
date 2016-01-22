/**
 * Ce module (NoteModele) contient les fonctionnalités de manipulation des données
 * de l'application Web de carnet de notes "Peanote".
 *
 * @see https://github.com/tastejs/todomvc/tree/gh-pages/examples/vanillajs 
 * 	Le code de ce module est adapté librement à partir du module correspondant 
 * 	dans l'application TodoMVC disponible à cette adresse.
 */
(function () {
	'use strict';

	// Ne fonctionne pas sur IE < 11.
	const NOTES_PAR_PAGE = 10;

	/**
	 * Crée une instance de NoteModele et lui associe une source de données.
	 *
	 * @constructor
	 * @param {object} sourceDonnees Une instance de la classe SourceDonnees.
	 */
	function NoteModele(sourceDonnees) {
		this.sourceDonnees = sourceDonnees;
	}

	/**
	 * Crée une nouvelle note
	 *
	 * @param {string} titre Le titre de la note.
	 * @param {function} fRappel La fonction à appeler une fois la note créée.
	 */
	NoteModele.prototype.creer = function (titre, fRappel) {
		var titre = titre || '';
		var fRappel = fRappel || function () {};

		var nouvelleNote = {
			titre: titre.trim(),
			archivee: false,
			importante: false
		};

		this.sourceDonnees.enregistrer(nouvelleNote, fRappel);
	};

	/**
	 * Recherche et retourne une note de la source de données. Si aucun identifiant 
	 * n'est spécifié, la méthode retourne toutes les notes.
	 * 
	 * @param {number} id Identifiant de la note recherchée
	 * @param {function} fRappel La fonction à appeler lorsque la ou les notes sont retournées
	 */
	NoteModele.prototype.lire = function (id, fRappel) {
		var typeId = typeof id;
		var fRappel = fRappel || function () {};
		if (typeId === 'function') {
			fRappel = id;
			return this.sourceDonnees.rechercherTout(fRappel, NOTES_PAR_PAGE);
		} else {
			id = parseInt(id, 10) || 0;
			this.sourceDonnees.rechercher({ id: requete }, fRappel);
		}
	};

	/**
	 * Modifie la note spécifiée par l'identifiant avec les données fournis.
	 *
	 * @param {number} id L'identifiant de la note à modifier.
	 * @param {object} donnees Les propriétés à modifier et leurs nouvelles valeurs .
	 * @param {function} fRappel Fonction à appeler lorsque la modification est complétée.
	 */
	NoteModele.prototype.modifier = function (id, donnees, fRappel) {
		this.sourceDonnees.enregistrer(donnees, fRappel, id);
	};

	/**
	 * Supprime la note spécifiée par son identifiant.
	 *
	 * @param {number} id L'identifiant de la note à supprimer.
	 * @param {function} fRappel Fonction à appeler lorsque la note est supprimée.
	 */
	NoteModele.prototype.supprimer = function (id, fRappel) {
		this.sourceDonnees.supprimer(id, fRappel);
	};

	/**
	 * Supprime toutes les notes de la source de données.
	 *
	 * @param {function} fRappel Fonction à appeler lorsque les notes sont supprimées.
	 */
	NoteModele.prototype.supprimerTout = function (fRappel) {
		this.sourceDonnees.effacer(fRappel);
	};

	/**
	 * Retourne le décompte des notes dans la source de données.
	 *
	 * @param {function} fRappel Fonction à appeler lorsque le décompte est complété.
	 */
	NoteModele.prototype.decompterNotes = function (fRappel) {
		var decompteNotes = {
			archivees: 0,
			importantes: 0,
			total: 0
		};

		this.sourceDonnees.rechercherTout(function (donnees) {
			donnees.forEach(function (note) {
				if (note.importante) {
					decompteNotes.importantes++;
				} else if (note.archivee)  {
					decompteNotes.archivees++;
				}

				decompteNotes.total++;
			});
			fRappel(decompteNotes);
		});
	};

	// Rendre notre Modele accessible globalement (window).
	// Remarquez qu'une seule variable globale est créée ("application")
	// Cette variable sera partagée par tous les modules de notre application.
	window.application = window.application || {};
	window.application.NoteModele = NoteModele;
})();
