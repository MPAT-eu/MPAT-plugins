/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lacaster University, Leadin, RBB, Mediaset
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * AUTHORS:
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
/**
 * original french l10n file
 */
const fr = {
  appMgr: {
    exclude: 'Exclude',
    navModels: {
      slideflow: 'La navigation SlideFlow permet au créateur de contenu de concevoir des pages d\'application plein écran et de spécifier l\'ordre dans lequel elles sont présentées. L\'expérience de l\'utilisateur est semblable à la navigation à travers une présentation de diapositives PowerPoint. <br /> Bien que les pages puissent contenir des points chauds sélectionnables pour fournir du contenu supplémentaire et des informations relatives à la page actuellement présentée, la navigation entre les pages individuelles est séquentielle, permettant au créateur de contenu de construire Sur les informations présentées sur les pages antérieures et établir un flux narratif.',
      timeline: 'La navigation basée sur les événements permet de diffuser le contenu de HbbTV par le programme de diffusion. L\'exemple le plus courant est la présentation d\'un bouton rouge au début d\'un programme télévisé ou d\'une annonce pour avertir le spectateur que des informations supplémentaires sont disponibles. Alors que l\'apparition du bouton est généralement déclenchée par des événements de flux MPEG, des canaux alternatifs. par exemple. Les sockets web ou les demandes d\'extraction d\'applications peuvent également être utilisées. <br/> La navigation basée sur l\'événement est la mieux adaptée aux petites insertions d\'informations.',
      website: 'Ce modèle est le plus utilisé pour les applications HbbTV. À partir d\'une page de destination, les utilisateurs accèdent à un contenu supplémentaire en sélectionnant sur les boutons d\'écran à l\'aide des touches fléchées - semblable à un site Web. Souvent, les boutons couleur / numériques peuvent également être utilisés. <br/> Bien que ce modèle soit commun, il ne convient pas à la narration numérique car le chemin des utilisateurs est arbitraire, chaque page doit donc être seule.'
    }
  },
  navModel: {
    sampleApp: 'Exemple d\'application',
    components: 'Composants'
  },
  componentLoader: {
    containerTitle: {
      label: 'Styles de conteneur'
    },
    fontSize: {
      label: 'Taille de police',
      placeholder: 'Taille en px'
    },
    fontWeight: {
      label: 'Poids du texte',
      placeholder: 'nombre de 100 à 900'
    },
    border: {
      label: 'Bordure',
      placeholder: 'Notation CSS "border" (par example: 1px solid #000)'
    },
    borderRadius: {
      label: 'Radius Bordure',
      placeholder: 'Taille en px'
    },
    margin: {
      label: 'Marge externe',
      placeholder: 'Taille en px'
    },
    padding: {
      label: 'Marge interne',
      placeholder: 'Taille en px'
    },
    color: {
      label: 'Couleur du texte'
    },
    backgroundColor: {
      label: 'Couleur de fond'
    }
  },
  formTypes: {
    fontSize: {
      label: 'Taille de police',
      placeholder: '14pt'
    },
    fontWeight: {
      label: 'Poids du texte',
      placeholder: 'number form 100 to 900'
    },
    border: {
      label: 'Bordure',
      placeholder: '1px solid #000'
    },
    borderRadius: {
      label: 'Bordure Radius',
      placeholder: '5px'
    },
    margin: {
      label: 'Marge externe',
      placeholder: '0px'
    },
    padding: {
      label: 'Marge interne',
      placeholder: '0px'
    },
    color: {
      label: 'Couleur du texte',
      placeholder: 'rgba() notation, HEX notation, color name'
    },
    backgroundColor: {
      label: 'Couleur de fond',
      placeholder: 'rgba() notation, HEX notation, color name'
    }
  },
  componentStateSelector: {
    enter: 'Déclencher lorsque vous appuyez sur OK sur cet élément',
    focus: 'Déclenchement lorsque l\'élément est activé',
    chooseAnAction: 'Choisissez une action'
  },
  pageSelector: {
    loading: 'CHARGEMENT',
    select: 'SÉLECTIONNER',
    noTitle: 'pas de titre',
    error: 'ERREUR',
    assetFinderPlaceholder: 'Tapez nom du "asset"'
   },
  styles: {
    choose: 'Choisissez',
    typeUrlOrSelectMedia: 'Saisissez URL ou sélectionnez un média'
  },
  stylesPopup: {
    done: 'Terminé'
  },
  textSubmit: {
    ok: 'OK'
  },
  hotSpotEdit: {
    edit: 'modifier',
    title: 'Hot Spot Icon',
    active: 'Actif',
    background: 'Fond',
    icon: 'Icône',
    orCustomFile: 'ou fichier personnalisé',
    focused: 'Concentré',
    normal: 'Normal',
    iconColour: 'Couleur de l\'icône',
    contentPosition: 'Content Position',
    location: 'Emplacement',
    overTheIcon: 'Sur l\'icône',
    underTheIcon: 'Sous l\'icône',
    static: 'Absolu / statique',
    staticContentPosition: 'Position du contenu statique',
    top: 'Haut',
    left: 'Gauche',
    contentSize: 'Taille du contenu (px)',
    width: 'largeur',
    height: 'Hauteur',
    ifEmptyFitContent: 'Si vide, il correspond au contenu',
    keyBinding: 'Reliure bouton',
    done: 'Terminé',
    or: 'ou',
    defaultIfAvailable: 'Par défaut, si disponible',
    customIcon: 'Icône personnalisée',
    choose: 'Choisissez',
    selectRemoteButton: 'Sélectionnez le bouton à distance'
  },
  imageCropper: {
    cropRatio: 'Couper par rapport',
    cropImage: 'Couper image',
    restore: 'Restaurer',
    crop: 'Couper',
    free: 'Libre'
  },
  layoutBuilder: {
    unused: 'Inutilisé',
    returnToPageEditor: 'Retourner à l\'éditeur de pages',
    save: 'SAUVEGARDER',
    layoutBuilder: 'Layout Builder',
    width: 'largeur',
    height: 'Hauteur',
    left: 'Gauche',
    top: 'Top',
    layoutTitle: 'Titre de la mise en page',
    placeholderTitle: 'Entrez le titre',
    previewBackground: 'Prévisualiser le fond',
    placeholderBg: 'Tapez url ou RGB',
    selectFile: 'Choisissez Fichier',
    addAnotherBox: 'Ajouter une autre case',
    add: 'Ajouter',
    showSafeArea: 'Montrer la zone sûre',
    showGridLines: 'Afficher les lignes de grille',
    layoutUsedInPages: 'Mise en page utilisée dans les pages'
  },
  undoRedo: {
    undo: 'ANNULER',
    redo: 'REFAIRE'
  },
  gallery: {
    removeImage: 'Supprimer l\'image',
    gallerySettings: 'Paramètres de la galerie',
    orientation: 'Orientation',
    horizontal: 'Horizontal',
    vertical: 'Verticale',
    imageCover: 'Couverture d\'image',
    zoomToFit: 'Images agrandies pour s\'adapter au conteneur',
    autoPlay: 'Lecture automatique',
    ms: 'Millisecondes',
    repeat: 'Répéter',
    loop: 'Boucle',
    useMediaKeys: 'Utiliser les clés de médias',
    dots: 'Points',
    arrows: 'Flèches',
    chooseImages: 'Choisissez images',
    clearSelections: 'Clear Selections',
    noImages: 'No Images',
    closeCropEditor: 'Close crop editor'
  },
  stateEditor: {
    title: 'Éditeur de composants',
    stateManagement: 'Gestion de l\'état',
    saveAsTemplate: 'Enregistrer en tant que modèle'
  },
  pageModelCreator: {
    chooseCustomBox: 'Choisissez des boîtes personnalisables',
    boxNb: 'Numéro de boîte',
    isItEditable: 'Modifiables',
    editableOrStyles: 'Styles modifiables',
    addOrRemoveFromAllowedTypes: 'Ajouter ou supprimer des types autorisés',
    allowedTypes: 'Allowed types',
    compontentTypeToAddOrRemove: 'Composant type to add or remove',
    any: 'tout',
    cancel: 'Annuler',
    create: 'Créer'
  },
  pageEditor: {
    title: 'Éditeur de pages',
    pageTitle: 'Titre de la page',
    pageLink: 'Lien vers la page',
    pageLayout: 'Mise en page',
    pageParent: 'Parent de la page',
    pageStyles: 'Styles de page',
    pageBg: 'Fond de page',
    scheduleUpdate: 'Mise à jour programmé',
    unsavedChanges: 'Vous avez des changements non enregistrés',
    untitled: 'Untitled',
    errorWhileSaving: 'Error while saving',
    confirmLeave: 'Vous avez des changements non enregistrés, voulez-vous vraiment quitter la page ?',
    chooseBgColor: 'Choisissez Couleur de fond',
    showHide: 'Afficher / Masquer',
    or: 'OU',
    movedToStyle: 'La couleur d\'arrière-plan de la page et les médias ont été déplacés vers les styles de page',
    createModelFromPage: 'Créer un modèle depuis la page',
    changeStyles: 'Modifier les styles',
    file: 'Fichier',
    create: 'Créer',
    pageFromModel: 'Page créée à partir du modèle',
    quickLink: 'Lien rapide vers',
    saveModelInstance: 'SAUVEGARDER INSTANCE DU MODELE',
    savePage: 'SAUVEGARDER PAGE',
    duplicate: 'dupliquer',
    editLayout: 'modifier la mise en page',
    typeUrlOrRgb: 'TYPE URL OR RGB',
    noParent: 'Aucun parent'
  },
  componentEditor: {
    editComponentStyle: 'Modifier les Styles Composants',
    editInner: 'Modifier...',
    titleComponentStyle: 'Style de  Composant',
    componentLabel: 'Étiquette de composant',
    componentType: 'Type de composant',
    chooseView: 'Choisissez Vue',
    hideFocus: 'Cacher Focus',
    navigable: 'Navigable',
    scrollable: 'Scrollable',
    hotSpot: 'Hot Spot',
    companionScreen: 'Écran de compagnon',
    thisIsAModel: 'Ce-ci est un modèle',
    editProtected: 'L\'édition est désactivée',
    editStubborn: 'Modifier de toute façon'
  },
  audio: {
    error: {
      formatNotSupported: 'FORMAT A / V NON SUPPORTÉ',
      connection: 'Impossible de se connecter au serveur ou connection perdu',
      unidentified: 'Erreur non identifiée', // by DAE 1.1 p. 263:
      resource: 'Ressources insuffisantes',
      corrupt: 'Contenu corrompu ou invalide',
      available: 'Contenu non disponible',
      positition: 'Contenu non disponible dans cette position donné',
      blocked: 'Contenu non disponible en raison du contrôle parental' //(by ETSI 1.2.1)
    },
    state: {
      stopped: 'ARRÊTÉ',
      playing: 'LECTURE EN COURS',
      paused: 'PAUSE',
      connected: 'TENTATIVE DE CONNECTION',
      buffering: 'Mise en mémoire tampon',
      finished: 'Terminé'
    },
    backend: {
      title: 'Les paramètres audio',
      audioUrlInput: 'Fichier Source',
      audioUrlLabel: 'Source Fichier',
      autoStart: 'Démarrage automatique',
      chooseFile: 'Choisissez Fichier',
      whenPageLoads: 'Lorsque la page est chargée',
      repeat: 'Répéter',
      loop: 'Boucler'
    }
  },
  broadcast: {
    notice1: 'Le composant de diffusion affiche le signal de diffusion sur le téléviseur.',
    notice2: 'Si vous testez ce composant sur votre bureau en utilisant',
    notice3: 'ou similaire, le composant sera affiché comme une boîte noire.'
  },
  clone: {
    choose: 'Choisissez',
    modelComponentPage: 'Composant Model de Page',
    layoutBox: 'Layout Box',
    component: 'Composant',
    title: 'Paramètres de clonage'
  },
  image: {
    title: 'Paramètres d\'image',
    url: 'URL de l\'image',
    upload: ' Télécharger l\'image',
    chooseFromLibrary: 'ou choisissez parmi la bibliothèque',
    choose: 'Choisissez'
  },
  launcher: {
    backend: {
      launcherSettings: 'Paramètres du Lanceur',
      toLinkAPage: 'Pour créer un lien vers une page spécifique de ce composant, ajoutez ce qui suit à votre lien',
      menuOrient: 'Orientation du menu',
      horizontal: 'Horizontal',
      vertical: 'Verticale',
      format: 'Format du Lanceur',
      landscape: 'Paysage',
      square: 'Carré',
      squareWithInfo: 'Carré avec Info',
      portrait: 'Portrait',
      launcherStyle: 'Style du Lanceur',
      optionStandard: 'Standard',
      optionArte: 'Arte',
      scrollStyle: 'Style de défilement',
      optionCarousel: 'Carrousel',
      optionPagination: 'Pagination',
      showPaginationInfo: 'Afficher les informations sur la pagination',
      addLauncherElement: 'Ajouter l\'élément Lanceur',
      launcherThumbnail: 'Aperçu du Lanceur',
      launcherThumbnailUrl: 'URL de l\'aperçu du Lanceur',
      chooseThumbnail: 'Choisissez une miniature',
      title: 'Titre',
      launcherTitle: 'Titre du Launceur',
      role: 'Rôle',
      link: 'Lien',
      controlTargetComponent: 'Contrôle composant ciblé',
      chooseTargetFirst: 'Choisir d\'abord la cible!',
      launcherTargetUrl: 'URL cible du lanceur',
      pages: 'Pages',
      state: 'Etat',
      description: 'Description',
      launcherDescription: 'Description du Lanceur',
      deleteLauncherElement: 'Supprimer l\'élément du Lanceur',
      optionalContentIcon: 'Icône de contenu facultatif',
      none: 'aucun',
      audio: 'audio',
      picture: 'image',
      text: 'texte',
      video: 'vidéo'
    },
    frontend: {
      monthNames: [
        'JANVIER', 'FÉVRIER',
        'MARS', 'AVRIL',
        'MAI', 'JUIN',
        'JUILLET', 'AOÛT',
        'SEPTEMBRE', 'OCTOBRE',
        'NOVEMBRE', 'DÉCEMBRE'],
      dayNames: [
        'DIMANCHE',
        'LUNDI',
        'MARDI',
        'MERCREDI',
        'JEUDI',
        'VENDREDI',
        'SAMEDI'
      ]
    }

  },
  link: {
    linkSettings: 'Paramètres du lien',
    linkImageUrl: 'Lien URL de l\'image',
    placeHolderLinkImageUrl: 'Lien URL de l\'image',
    chooseLinkImage: 'Choisissez l\'image du lien',
    linkLabel: 'Étiquette de lien',
    placeHolderLinkLabel: 'Étiquette de lien',
    or: 'OU',
    linkTarget: 'Lien cible',
    placeHolderLinkUrl: 'Url de lien',
    pages: 'Pages',
    imageLayoutCover: 'Couverture de la mise en page de l\'image'
  },
  list: {
    listSettings: 'Paramètres de la liste',
    addListElement: 'Ajouter un élément de liste',
    title: 'Titre',
    placeHolderTitle: 'TITRE DE L\'ÉLÉMENT',
    url: 'URL',
    placeHolderUrl: 'URL ELEMENT CIBLE',
    description: 'Description',
    placeHolderDesc: 'DESCRIPTION DE L\'ÉLÉMENT',
    deleteListElement: 'Supprimer l\'élément de la liste'
  },
  menu: {
    menuSettings: 'Paramètres du menu',
    addMenuItem: 'Ajouter un élément de menu',
    title: 'Titre',
    sideMenu: 'Menu latéral',
    showAsSideMenu: 'Affiche en tant que menu latéral',
    menuOrient: 'Orientation du menu',
    horizontal: 'Horizontal',
    vertical: 'Verticale',
    loop: 'Boucle',
    restart: 'Si la navigation doit recommencer à partir du premier élément après la dernière (et vice-versa) ou non',
    showButtons: 'Afficher les boutons',
    showRemoteKeys: 'Afficher les touches de la télécommande',
    selectAction: 'Sélectionnez l\'action',
    goToPrevPage: 'Aller à la page précédente',
    toggleApplication: 'Activer l\'application (afficher/cacher)',
    label: 'Étiquette',
    placeHolderLabel: 'TEXTE MENU',
    remoteKey: 'Bouton de télécommande',
    remoteControlKey: 'Bouton de télécommande',
    role: 'Rôle',
    link: 'Lien',
    controlApplication: 'Application de contrôle',
    controlTargetComponent: 'Contrôlez le composant cible',
    launchAppViaAIT: 'Lancer l\'application via AIT',
    url: 'URL',
    placeHolderUrl: 'URL CIBLE',
    pages: 'Pages',
    appId: 'App ID',
    fallbackUrl: 'URL de recule',
    appAction: 'Application Action',
    state: 'Etat',
    deleteItem: 'Supprimer l\'élément de menu',
    addItem: 'Ajouter un élément de menu'
  },
  redbutton: {
    redButtonSettings: 'Paramètres du Bouton Rouge',
    buttonImage: 'Image du bouton',
    placeHolderImageUrl: 'URL DE L\'IMAGE',
    chooseImage: 'Choisissez Image',
    redButtonLink: 'Lien bouton rouge',
    placeHolderRedButtonLink: 'LIEN URL',
    fadeInTime: 'Durée de fondu (s)',
    placeHolderFadeInTime: 'SECONDES',
    displayDuration: 'Durée de l\'affichage (s)',
    placeHolderDisplayDuration: 'SECONDES'
  },
  scribbleLive: {
    noPreviewAvailable: 'Flux ScribleLive. Aucun aperçu spécifique disponible.',
    title: 'Scribble Live',
    hint1: 'Astuce: utilisez le',
    hint2: 'Pour les paramètres de langue. (Pour afficher des informations liées au temps, par example',
    hint3: 'il y a un an'
  },
  scrolledText: {
    title: 'Paramètres de défilement de texte',
    arrowColor: 'Couleur de Flèche',
    activeArrowColor: 'Couleur de Flèche Active',
    arrowPlacement: 'Placement de flèche',
    onText: 'Sur le texte',
    left: 'gauche',
    right: 'droite',
    aboveBelow: 'Dessus/Dessous',
    outside: 'à l\'extérieur',
    noArrows: 'pas de flêches'
  },
  toggleTracking: {
    title: 'Basculer les paramètres de suivi',
    enabledText: 'Texte activé',
    disabledText: 'Texte désactivé',
    button: 'Bouton'
  },
  video: {
    title: 'Paramètres Vidéo',
    asset: 'Asset',
    src: 'Source Vidéo',
    placeHolderSrc: 'URL VIDEO',
    or: 'OU',
    chooseVideo: 'Choisissez Vidéo',
    thumbnail: 'Vignette Vidéo',
    placeHolderThumbnail: 'URL VIGNETTE',
    chooseThumbnail: 'Choisissez Vignette',
    autoPlay: 'Lecture automatique',
    startPlaybackWhenPage: 'Démarrer la lecture lorsque la page s\'ouvre',
    repeat: 'Répéter',
    loop: 'Boucler vidéo',
    fullscreenStart: 'Démarrage en plein écran',
    startVideoFullScr: 'Démarrage en plein écran',
    removeBlackBars: 'Retirer les bandes noires',
    zoomVideo: 'Zoomer la vidéo pour supprimer les bandes noires',
    playIcon: 'Icône lecture',
    showPlayIcon: 'Afficher l\'icône de lecteur quand la vidéo est prete',
    showNavBar: 'Afficher la barre de navigation'
  },
  timeline: {
    title: 'Chronologie',
    range: 'Rangée',
    duration: 'Durée (sec)',
    fps: 'Trames par seconde',
    select_range: 'Please select a range',
    editting_range: 'Editting range {0}',
    no_selection: 'No time range currently selected',
    new_project: 'Nouveau project {0}',
    existing_project: 'Restauration de projet du blog "{0}" possible.',
    restore: {
      button: { value: 'Restaurer' },
      wait: 'Patientez {0} secondes.',
      skipload: ' (restauré il-y-a {0} secondes a {1})',
      scenario_loaded: 'Scénario pour {0} avec {1} évenements publié a {2}',
      nothing_to_restore: 'Rien a restaurer',
      restored: '{0} évenements restauré.',
      no_overwrite: 'Maintien de l\'environnement de travail',
      ask_to_overwrite: 'Écraser l\'environnement de travail?'
    },
    publish: {
      button: {
        value: 'Publier'
      },
      publishing: 'En cours de publication...',
      no_ovewrite: 'Annulation d\'écrasement de scénario',
      warning_overwrite: 'ATTENTION!:\nCeci écrasera le scénario pour le site \'{0}\'\n\nVoulez-vous cotin' +
      'uer?',
      wait: 'Patientez {0} secondes.',
      saved: ' (sauvegardé il-y-a {0} secondes a {1})',
      notsaving: 'Sauvegarde pas possible: scénario est vide',
      scenario_published: 'Scénario pour {0} avec {1} évenements publié a {2}'
    },
    remove: {
      button: {
        value: 'Publier'
      },
      deleting: 'En cours de publication...',
      no_ovewrite: 'Annulation d\'écrasement de scénario',
      warning_overwrite: 'ATTENTION!:\nCeci écrasera le scénario pour le site \'{0}\'\n\nVoulez-vous cotin' +
      'uer?',
      wait: 'Patientez {0} secondes.',
      saved: ' (sauvegardé il-y-a {0} secondes a {1})',
      notsaving: 'Sauvegarde pas possible: scénario est vide',
      scenario_deleted: 'Scénario pour {0} avec {1} évenements publié a {2}'
    },
    rangeEdit: {
      button: {
        value: 'Activer la modification',
        title: 'Rafraîchissez et/ou activez la révision de la gamme de temps choisie'
      },
      button2: {
        value: 'Échanger',
        title: 'Échanger la gamme selectionné avec celui à côté à droit'
      },
      event: {
        type: 'Type',
        keycode: 'KeyCode',
        data: 'Donnée',
        begin: 'Début',
        dura: 'Durée'
      },
      eventOptions: {
        streamEvent: 'StreamEvent',
        keyEvent: 'KeyEvent',
        mediaEvent: 'MediaEvent',
        timeEvent: 'TimeEvent',
        clockEvent: 'ClockEvent'
      },
      time: 'Temps',
      page: 'Page'
    },
    rangeRemove: {
      button: {
        value: 'Supprimer la selection',
        title: 'Supprimer la gamme selectioné'
      }
    },
    rangeTool: {
      range: 'Event Editing',
      swapButton: {
        value: 'Échanger',
        title: 'Échanger la gamme selectionné avec celui à côté à droit'
      }
    },
    restoreButton: {
      error: 'Erreur chargeant le scénario'
    },
    timelineEditor: {
      error: { unableToSet: 'Avertissement : incapable de mettre la valeur' }
    },
    dsmcc: {
      title: 'Streamevent Containeur',
      button: {
        download: {
          link: 'Télécharger',
          title: 'Obtenez un XML formaté DSMCC pour les événements de flux'
        },
        save: {
          link: 'Sauvegarder',
          title: 'Sauvegarder les paramètres DSMCC'
        }
      },
      fileName: 'dsmcc.xml',
      seID: {
        label: 'StreamEvent ID',
        title: 'StreamEvent ID (1-65535)'
      },
      seName: {
        label: 'StreamEvent Name',
        title: 'StreamEvent Name (TXT)'
      },
      seComponentTag: {
        label: 'Composant Tag',
        title: 'Composant Tag (1-255)'
      },
      labelUrl: 'URL',
      error: {
        onLoad: 'L\'erreur en recevant l\'option de DSMCC, modifiez des valeurs et essayez de nouveau',
        onSave: 'Erreur sauvant l\'option de DSMCC'
      },
      saved: 'Les informations DSMCC sont sauvé'
    },
    elementMenu: {
      noFreeSpace: 'aucun espace libre',
      enterKeyCode: 'Saisissez code bouton',
      addToTheTimeline: 'Ajoutez à la chronologie',
      back: 'Retour',
      addAPage: 'Ajouter une page',
      inTheBack: 'vers l\'arrière',
      backPage: 'Arrière page',
      remove: 'Enlever',
      addEventLinkToPage: 'Ajoutez un événement lié à une page',
      abbr: {
        streamEvent: 'StreamEv',
        keyEvent: 'KeyEv',
        mediaEvent: 'MediaEv',
        timeEvent: 'TimeEv',
        clockEvent: 'ClockEv'
      },
      targetPage: 'Page cible',
      addElement: 'Ajouter élément'
    }
  },
  frontend: {
    video360: {
      error: 'Erreur',
      deviceNotSupported: 'Votre appareil n\'est pas pris en charge.'
    }
  }
};
module.exports = fr;
