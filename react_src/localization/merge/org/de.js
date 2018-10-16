const de = {
  appMgr: {
    exclude: 'Ausschließen',
    navModels: {
      slideflow: 'Die Slideflow-Navigation ermöglicht es dem Redakteur, Anwendungen zu erstellen, die ähnlich einer PowerPoint Präsentation, entweder horizontal oder vertikal geführt sind. Dabei ist es möglich, die Reihenfolge in der die Seiten präsentiert werden sollen, zu bestimmen. <br /> Die Seiten können wählbare Hotspots enthalten, um zusätzliche Inhalte und Informationen in Bezug auf die aktuell präsentierte Seite bereitzustellen. Die Navigation zwischen den einzelnen Seiten ist sequentiell, so dass der Redakteur auf Informationen, die auf früheren Seiten präsentiert wurden schlecht zurückgreifen kann. Die Slideflow-Navigation bietet sich für Applikationen die eher Erzählcharakter haben, an.',
      timeline: 'Event-basierte Navigation ermöglicht die Darstellung von HbbTV-Inhalten getriggert durch das Fernsehprogramm. Das bekannteste Beispiel ist die Präsentation des „Red Buttons“ bei Programmstart. Der „Red Button“ signalisiert dem Betrachter, dass zusätzliche Informationen verfügbar sind. Das Erscheinen der Schaltfläche wird in der Regel durch MPEG-Stream-Ereignisse oder alternative Kanäle wie z.B. Web-Sockets oder aber auch durch Applikations-Pull-Anfragen ausgelöst. <br/> <br/> Event-basierte Navigation eignet sich am besten für kurze Informationen, die auf den eigentlichen Inhalt nur Verweisen.',
      website: 'Das Webseiten-Modell wird am häufigsten für HbbTV Applikationen verwendet. Von einer Startseite aus erhält der Benutzer Zugriff auf alle zusätzlichen Inhalte. Steuern tut der Nutzer die Applikation entweder mit den Pfeiltasten seiner Fernbedienung - ähnlich wie mit der Mouse auf einer Webseite, oder über Shortcuts, indem auch Farb- und Zifferntasten verwendet werden. <br/> Bei diesem Modell gibt es keine geführte Bedienung, der Nutzer kann frei durch die Applikation navigieren, deshalb muss jede Seite so aufgebaut sein, dass sie auch für sich alleine stehen kann.'
    }
  },
  navModel: {
    sampleApp: 'Beispiel Applikation',
    components: 'Komponenten'
  },
  componentLoader: {
    containerTitle: {
      label: 'Container Styles'
    },
    fontSize: {
      label: 'Schriftgröße',
      placeholder: 'Größe in px'
    },
    fontWeight: {
      label: 'Schriftstärke',
      placeholder: 'Zahlen von 100 bis 900'
    },
    border: {
      label: 'Rahmen',
      placeholder: 'CSS Rahmen Notation (z.B. 1px solid #000)'
    },
    borderRadius: {
      label: 'Rahmen Radius',
      placeholder: 'Radius in px'
    },
    margin: {
      label: 'Margin',
      placeholder: 'Abstand in px'
    },
    padding: {
      label: 'Padding',
      placeholder: 'Abstand in px'
    },
    color: {
      label: 'Schriftfarbe'
    },
    backgroundColor: {
      label: 'Hintergrundfarbe'
    }
  },
  formTypes: {
    fontSize: {
      label: 'Schriftgröße',
      placeholder: '14pt'
    },
    fontWeight: {
      label: 'Schriftstärke',
      placeholder: 'Zahlen von 100 bis 900'
    },
    border: {
      label: 'Rahmeneigenschaften',
      placeholder: '1px solid #000'
    },
    borderRadius: {
      label: 'Rahmen Radius',
      placeholder: '5px'
    },
    margin: {
      label: 'Margin',
      placeholder: '0px'
    },
    padding: {
      label: 'Padding',
      placeholder: '0px'
    },
    color: {
      label: 'Schriftfarbe',
      placeholder: 'rgba() Notation, HEX Notation, color name'
    },
    backgroundColor: {
      label: 'Hintergrundfarbe',
      placeholder: 'rgba() Notation, HEX Notation, color name'
    }
  },
  componentStateSelector: {
    enter: 'Trigger, wenn OK gedrückt wird',
    focus: 'Trigger, wenn das Objekt fokussiert wird',
    chooseAnAction: 'Wähle eine Aktion'
  },
  assetFinder: {
    placeholder: 'VERGEBE MEDIENNAMEN'
  },
  pageSelector: {
    loading: 'LADEN',
    select: 'AUSWÄHLEN',
    noTitle: 'kein Titel',
    error: 'FEHLER'
  },
  styles: {
    choose: 'ÖFFNEN',
    typeUrlOrSelectMedia: 'Eingabe einer URL oder Auswahl einer Mediendatei'
  },
  stylesPopup: {
    done: 'Fertig'
  },
  textSubmit: {
    ok: 'OK'
  },
  hotSpotEdit: {
    edit: 'bearbeiten',
    title: 'Hot Spot Symbol',
    active: 'Aktiv',
    background: 'Hintergrund',
    icon: 'Symbol',
    orCustomFile: 'oder eigene Datei',
    focused: 'Fokussiert',
    normal: 'Normal',
    iconColour: 'Symbolfarbe',
    contentPosition: 'Position des Inhaltes',
    location: 'Lage',
    overTheIcon: 'Über dem Symbol',
    underTheIcon: 'Unter dem Symbol',
    static: 'Absolut/statisch',
    staticContentPosition: 'Statische Content Position',
    top: 'Oben',
    left: 'Links',
    contentSize: 'Content Größe (px)',
    width: 'Breite',
    height: 'Höhe',
    ifEmptyFitContent: 'falls leer, wird es an den Inhalt angepasst',
    keyBinding: 'Key Binding',
    done: 'Fertig',
    or: 'OR',
    defaultIfAvailable: 'Voreinstellung, falls möglich',
    customIcon: 'Eigenes Symbol',
    choose: 'Öffnen',
    selectRemoteButton: 'Wähle eine Fernbedienungstaste'
  },
  imageCropper: {
    cropRatio: 'Seitenverhältnis anpassen',
    cropImage: 'Bild anpassen',
    restore: 'Wiederherstellen',
    crop: 'Anpassen',
    free: 'Freihand'
  },
  layoutBuilder: {
    unused: 'Nicht benutzt',
    returnToPageEditor: 'ZURÜCK ZUM SEITENEDITOR',
    save: 'SPEICHERN',
    layoutBuilder: 'Layout Editor',
    width: 'Breite',
    height: 'Höhe',
    left: 'Links',
    top: 'Oben',
    layoutTitle: 'Layout Bezeichnung',
    placeholderTitle: 'TITEL HIER EINGEBEN',
    previewBackground: 'Vorherigen Hintergrund',
    placeholderBg: 'URL ODER RGB EINGEBEN',
    selectFile: 'Datei öffnen',
    addAnotherBox: 'Box hinzufügen',
    add: 'Hinzufügen',
    showSafeArea: 'ANZEIGEN DER SAFE AREA',
    showGridLines: 'ANZEIGEN VON HILFSLINIEN',
    layoutUsedInPages: 'LAYOUT WIRD BEREITS VERWENDET IN'
  },
  undoRedo: {
    undo: 'RÜCKGÄNGING',
    redo: 'WIEDERHERSTELLEN'
  },
  gallery: {
    removeImage: 'Bild entfernen',
    gallerySettings: 'Galerie Einstellungen',
    orientation: 'Orientierung',
    horizontal: 'Horizontal',
    vertical: 'Vertikal',
    imageCover: 'Bild an Box anpassen',
    zoomToFit: 'Bild an Container anpassen',
    autoPlay: 'Autoplay',
    ms: 'Millisekunden',
    repeat: 'Wiederholen',
    loop: 'Loop',
    useMediaKeys: 'Verwenden von Mediakeys',
    dots: 'Punkte',
    arrows: 'Pfeile',
    chooseImages: 'Bilddatei öffnen',
    clearSelections: 'Auswahl löschen',
    noImages: 'Keine Bilder ausgewählt',
    closeCropEditor: 'Editor schließen'
  },
  stateEditor: {
    title: 'Komponenten Editor',
    stateManagement: 'State Management',
    saveAsTemplate: 'Template speichern'
  },
  pageModelCreator: {
    chooseCustomBox: 'Wähle nutzerspezifische Boxen',
    boxNb: 'Box-Nummer',
    isItEditable: 'Editierbar',
    editableOrStyles: 'Editierbare Ansichten',
    addOrRemoveFromAllowedTypes: 'Hinzufügen oder Entfernen von möglichen Komponenten',
    allowedTypes: 'Mögliche Ansichten',
    compontentTypeToAddOrRemove: 'Komponenten Hinzufügen oder Entfernen',
    any: 'ANDERE',
    cancel: 'Abbrechen',
    create: 'Erstellen'
  },
  pageEditor: {
    title: 'Seiten Editor',
    pageTitle: 'Titel der Seite',
    pageLink: 'Link der Seite',
    pageLayout: 'Seitenlayout',
    pageParent: 'Übergeordnete Seiten',
    pageStyles: 'Seitenansicht',
    pageBg: 'Seitenhintergrund',
    scheduleUpdate: 'Updates planen',
    unsavedChanges: 'Sie haben nicht gespeicherte Änderungen',
    untitled: 'Unbezeichnet',
    errorWhileSaving: 'Fehler während des Speicherns',
    confirmLeave: 'Sie haben nicht gespeicherte Änderungen, wollen Sie wirklich die Seite verlassen?',
    chooseBgColor: 'Wähle die Hintergrundfarbe',
    show: 'Zeigen',
    or: 'ODER',
    movedToStyle: 'Die Seitenhintergrundfarbe und die Medien sind nun unter Seitenansicht zu finden',
    createModelFromPage: 'Seitenmodell erstellen',
    changeStyles: 'Ändere Ansicht',
    file: 'Datei',
    create: 'Erstellen',
    pageFromModel: 'Seite aus Seitenmodell generieren',
    quickLink: 'Seitenwechsel auf',
    saveModelInstance: 'SPEICHERE MODELLINSTANZ',
    savePage: 'SPEICHERE SEITE',
    duplicate: 'duplizieren',
    editLayout: 'LAYOUT BEARBEITEN',
    typeUrlOrRgb: 'URL ODER RGB EINGEBEN',
    noParent: 'keine übergeordnete Seite'
  },
  componentEditor: {
    editComponentStyle: 'Komponentenansicht bearbeiten',
    editInner: 'Ändern...',
    titleComponentStyle: 'Komponenten Ansicht',
    componentLabel: 'Komponenten Bezeichnung',
    componentType: 'Komponenten Auswahl',
    chooseView: 'Wähle Ansicht',
    hideFocus: 'Focus nicht anzeigen',
    navigable: 'Navigierbar',
    scrolllable: 'Scrollbar',
    hotSpot: 'Hot Spot',
    companionScreen: 'Companion Screen',
    thisIsAModel: 'Das ist ein Modell',
    editProtected: 'Bearbeitung nicht möglich',
    editStubborn: 'Trotzdem Bearbeiten'
  },
  audio: {
    title: 'Audio Einstellungen',
    audioUrlInput: 'Quelldatei',
    audioUrlLabel: 'Quelldatei',
    autoStart: 'Autostart',
    chooseFile: 'Datei öffnen',
    whenPageLoads: 'Wenn die Seite lädt',
    repeat: 'Wiederholen',
    loop: 'Loop'
  },
  broadcast: {
    notice1: 'Die Broadcast Komponente stellt das Fernsehsignal auf dem Fernseher da.',
    notice2: 'Falls Sie diese Komponente auf Ihrem Rechner mit Hilfe von',
    notice3: 'oder Ähnlichem testen, wird die Komponente nur als schwarze Box dargestellt.'
  },
  clone: {
    choose: 'Öffnen',
    modelComponentPage: 'Seitenmodelle',
    layoutBox: 'Layout Box',
    component: 'Komponente'
  },
  image: {
    title: 'Bilder Einstellungen',
    url: 'Bilddatei URL',
    upload: ' Upload Bilddatei',
    chooseFromLibrary: 'oder wähle ein Bild aus der Bibliothek',
    choose: 'Öffnen'
  },
  launcher: {
    backend: {
      launcherSettings: 'Launcher Einstellungen',
      toLinkAPage: 'Um auf eine bestimmte Komponente der Seite zu verlinken, muss folgendes an den Link gehängt werden',
      menuOrient: 'Menü Orientierung',
      horizontal: 'Horizontal',
      vertical: 'Vertikal',
      format: 'Launcher Format',
      landscape: 'Querformat',
      square: 'Quadratisch',
      squareWithInfo: 'Quadratisch mit Information',
      portrait: 'Hochformat',
      launcherStyle: 'Launcher Ansicht',
      optionStandard: 'Standard',
      optionArte: 'Arte',
      scrollStyle: 'Scrollart',
      optionCarousel: 'Karussell',
      optionPagination: 'Seitennummerierung',
      showPaginationInfo: 'Zeige Seitennummerierung',
      addLauncherElement: 'Füge Launcher Element hinzu',
      launcherThumbnail: 'Launcher Thumbnail',
      launcherThumbnailUrl: 'Launcher Thumbnail URL',
      chooseThumbnail: 'Thumbnail öffnen',
      title: 'Titel',
      launcherTitle: 'Launcher Titel',
      role: 'Rolle',
      link: 'Link',
      controlTargetComponent: 'Zielkomponente steuern',
      chooseTargetFirst: 'Erst Zielkomponente auswählen',
      launcherTargetUrl: 'Launcher Ziel-URL',
      pages: 'Seiten',
      state: 'Status',
      description: 'Beschreibung',
      launcherDescription: 'Launcher Beschreibung',
      deleteLauncherElement: 'Lösche Launcher Element',
      optionalContentIcon: 'Eigenes Logo',
      none: 'keine',
      audio: 'Audio',
      picture: 'Bild',
      text: 'Text',
      video: 'Video'
    },
    frontend: {
      monthNames: ['JANUAR', 'FEBRUAR',
        'MÄRZ', 'APRIL',
        'MAI', 'JUNI',
        'JULI', 'AUGUST',
        'SEPTEMBER', 'OKTOBER',
        'NOVEMBER', 'DEZEMBER'],
      dayNames: [
        'SONNTAG',
        'MONTAG',
        'DIENSTAG',
        'MITTWOCH',
        'DONNERSTAG',
        'FREITAG',
        'SAMSTAG']
    }
  },
  link: {
    linkSettings: 'Link Einstellungen',
    linkImageUrl: 'Link als Bild',
    placeHolderLinkImageUrl: 'BILDDATEI URL',
    chooseLinkImage: 'Bilddatei öffnen',
    linkLabel: 'Link Bezeichnung',
    placeHolderLinkLabel: 'BEZEICHNUNG',
    or: 'ODER',
    linkTarget: 'Link URL',
    placeHolderLinkUrl: 'URL',
    pages: 'Seiten',
    imageLayoutCover: 'Bild an Box anpassen'
  },
  list: {
    listSettings: 'Listen Einstellungen',
    addListElement: 'Füge ein Listen Element hinzu',
    title: 'Titel',
    placeHolderTitle: 'ELEMENT TITEL',
    url: 'URL',
    placeHolderUrl: 'ELEMENT ZIEL-URL',
    description: 'Beschreibung',
    placeHolderDesc: 'ELEMENT BESCHREIBUNG',
    deleteListElement: 'Lösche Listen Element'
  },
  menu: {
    menuSettings: 'Menü Einstellungen',
    addMenuItem: 'Füge Menüpunkt hinzu',
    title: 'Titel',
    sideMenu: 'Aufklapp-Menü',
    showAsSideMenu: 'Zeige Menü als Aufklapp-Menü',
    menuOrient: 'Menü Orientierung',
    horizontal: 'Horizontal',
    vertical: 'Vertikal',
    loop: 'Loop',
    restart: 'Egal ob die Navigation nach dem letzten Menüpunkt wieder beim ersten Menüpunkt beginnt (und umgekehrt) oder nicht',
    showButtons: 'Menüpunkte als Buttons',
    showRemoteKeys: 'Zeige Fernbedienungstasten als Icons an',
    selectAction: 'Wähle eine Aktion aus',
    goToPrevPage: 'Gehe zu vorheriger Seite',
    toggleApplication: 'Wechsle Applikationsmodus (zeigen/verstecken)',
    label: 'Bezeichnung',
    placeHolderLabel: 'MENÜ TEXT',
    remoteKey: 'Fernbedienungstaste',
    remoteControlKey: 'Fernbedienungstaste kontrollieren',
    role: 'Rolle',
    link: 'Link',
    controlApplication: 'Applikation kontrollieren',
    controlTargetComponent: 'Zielkomponente kontrollieren',
    launchAppViaAIT: 'Starte Applikation via AIT',
    url: 'URL',
    placeHolderUrl: 'ZIEL-URL',
    pages: 'Seiten',
    appId: 'App ID',
    fallbackUrl: 'Fallback URL',
    appAction: 'Aufgabe der Applikation',
    state: 'Status',
    deleteItem: 'Lösche Menüpunkt',
    addItem: 'Weiterer Menüpunkt'
  },
  redbutton: {
    redButtonSettings: 'Red Button Einstellung',
    buttonImage: 'Bild für Button',
    placeHolderImageUrl: 'URL zur Bilddatei',
    chooseImage: 'Bilddatei öffnen',
    redButtonLink: 'Red Button Link',
    placeHolderRedButtonLink: 'LINK URL',
    fadeInTime: 'Fade-in Zeit (s)',
    placeHolderFadeInTime: 'SEKUNDEN',
    displayDuration: 'Anzeigedauer (s)',
    placeHolderDisplayDuration: 'SEKUNDEN'
  },
  scribbleLive: {
    noPreviewAvailable: 'ScribleLive Feed. Keine Vorschau möglich.',
    title: 'Scribble Live',
    hint1: 'Hinweis: Bitte ',
    hint2: 'für Spracheinstellungen nutzen (um zeitrelevante Informationen darzustellen wie z.B.',
    hint3: 'vor einem Jahr'
  },
  scrolledText: {
    title: 'ScrolledText Einstellungen',
    arrowColor: 'Pfeilfarbe',
    activeArrowColor: 'Pfeilfarbe aktiv',
    arrowPlacement: 'Pfeilanordnung',
    onText: 'im Text',
    left: 'links',
    right: 'rechts',
    aboveBelow: 'oben/unten',
    outside: 'außen',
    noArrows: 'keine Pfeile'
  },
  toggleTracking: {
    title: 'Ändere Tracking Einstellungen',
    enabledText: 'Aktiviere Text',
    disabledText: 'Sperre Text',
    button: 'Button'
  },
  video: {
    title: 'Video Einstellungen',
    asset: 'Medien',
    src: 'Videoquelle',
    placeHolderSrc: 'VIDEO URL',
    or: 'ODER',
    chooseVideo: 'Videodatei öffnen',
    thumbnail: 'Video Thumbnail',
    placeHolderThumbnail: 'THUMBNAIL URL',
    chooseThumbnail: 'Thumbnail öffnen',
    autoPlay: 'Autoplay',
    startPlaybackWhenPage: 'Starte das Video mit Seitenaufruf',
    repeat: 'Wiederholen',
    loop: 'Loop video',
    fullscreenStart: 'Fullscreen Modus starten',
    startVideoFullScr: 'Starte Video in Fullscreen Modus',
    removeBlackBars: 'Entferne schwarze Balken',
    zoomVideo: 'Video skalieren um schwarze Balken zu vermeiden',
    playIcon: 'Play Symbol',
    showPlayIcon: 'Play Symbol anzeigen, wenn das Video bereit ist',
    showNavBar: 'Anzeige der Navigation',
    stopAfterDeselecting: 'Stoppe wenn die Komponente nicht mehr ausgewählt ist'
  },
  timeline: {
    title: 'Timeline',
    range: 'Bereich',
    duration: 'Dauer (sec)',
    fps: 'Frames pro Sekunde',
    select_range: 'Bitte einen Bereich wählen',
    editting_range: 'Bereich ändern {0}',
    no_selection: 'Es ist kein Zeitbereich ausgewählt',
    new_project: 'Neues Projekt {0}',
    existing_project: 'Projekt von "{0}" Blog wiederherstellbar',
    restore: {
      button: { value: 'Wiederherstellen' },
      wait: 'Bitte {0} Sekunden warten.',
      skipload: ' (wiederhergestellt {0} {1} Sekunden später)',
      scenario_loaded: 'Szene wiederherstellen',
      nothing_to_restore: 'Nichts zu wiederherstellen',
      restored: ' {0} Wiederherstellungsprozesse',
      no_overwrite: 'Den aktuellen Workspace behalten',
      ask_to_overwrite: 'Den aktuellen Workspace überschreiben?'
    },
    publish: {
      button: {
        value: 'Speichern'
      },
      publishing: 'Speichern...',
      no_ovewrite: 'Veröffentlichung verwerfen um Datenverlust zu vermeiden',
      warning_overwrite: 'WARNUNG!:\nDer Vorgang wird das aktuelle Szenario überschreiben \'{0}\'\n\nMit Speichern fortfahren?',
      wait: 'Bitte {0} Sekunden warten',
      saved: ' (saved {0}s ago at {1})',
      notsaving: 'Nicht speichern, das Szenario ist leer',
      scenario_published: '{0} Szenario mit {1} Ereignissen wurde veröffentlicht um {2}'
    },
    remove: {
      button: {
        value: 'Szenario löschen'
      },
      deleting: 'Löschen...',
      no_ovewrite: 'Löschenvorgang abbrechen, um Datenverlust zu vermeiden',
      warning_overwrite: 'WARNUNG!:\nDiese Aktion wird das aktuelle Szenario überschreiben \'{0}\'\n\nMit dem Löschen' +
      'fortfahren?',
      wait: 'Bitte {0} Sekunden warten.',
      saved: ' (saved {0}s ago at {1})',
      notsaving: 'Nicht speichern, das Szenario ist leer',
      scenario_deleted: '{0} Szenarios mit {1} Ereignissen gelöscht um {2}'
    },
    rangeEdit: {
      button: {
        value: 'Bearbeiten aktivieren',
        title: 'Bearbeiten des ausgewählten Zeitbereiches Aktualisieren und/oder Aktivieren'
      },
      button2: {
        value: 'Auswahl umkehren',
        title: 'Auswahlbereich umkehren mit next to the right'
      },
      event: {
        type: 'Typ',
        keycode: 'KeyCode',
        data: 'Daten',
        begin: 'Beginn',
        dura: 'Dauer'
      },
      eventOptions: {
        streamEvent: 'StreamEvent',
        keyEvent: 'KeyEvent',
        mediaEvent: 'MediaEvent',
        timeEvent: 'TimeEvent',
        clockEvent: 'ClockEvent'
      },
      time: 'Zeit',
      page: 'Seite'
    },
    rangeRemove: {
      button: {
        value: 'Auswahl entfernen',
        title: 'Auswahlbereich entfernen'
      }
    },
    rangeTool: {
      range: 'Event Editing',
      swapButton: {
        value: 'Auswahl umkehren',
        title: 'Auswahlbereich umkehren next to the right'
      }
    },
    restoreButton: {
      error: 'Ladefehler Szenario'
    },
    timelineEditor: {
      error: { unableToSet: 'Warnung: nicht möglich den Wert zu setzen' }
    },
    dsmcc: {
      title: 'Streamevent Container',
      button: {
        download: {
          link: 'Download',
          title: 'Ein DSMCC formatierte XML Datei abrufen für Streamevents'
        },
        save: {
          link: 'Speichern',
          title: 'DSMCC Einstellungen speichern'
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
        label: 'Component Tag',
        title: 'Component Tag (1-255)'
      },
      labelUrl: 'URL',
      error: {
        onLoad: 'Fehler beim Erhalten der DSMCC Option, bitte Werte noch einmal überprüfen und gegebenenfalls ändern.',
        onSave: 'Fehler beim Speichern der DSMCC Option'
      },
      saved: 'DSMCC Information gespeichert'
    },
    elementMenu: {
      noFreeSpace: 'kein freier Platz',
      enterKeyCode: 'Keycode eingeben',
      addToTheTimeline: 'Zu Timeline hinzufügen',
      back: 'Zurück',
      addAPage: 'Seite hinzufügen',
      inTheBack: 'Im Hintergrund',
      backPage: 'Rückseite',
      remove: 'Löschen',
      addEventLinkToPage: 'Ein Ereignis mit einer Seite verlinken',
      abbr: {
        streamEvent: 'StreamEv',
        keyEvent: 'KeyEv',
        mediaEvent: 'MediaEv',
        timeEvent: 'TimeEv',
        clockEvent: 'ClockEv'
      },
      targetPage: 'Zielseite',
      addElement: 'Element hinzufügen'
    },
    bbBox: {
      title: 'BeeBee Box',
      button: {
        link: 'Generieren',
        title: 'BeeBee Box formatiertes XML für Streamevents abrufen'
      },
      fileName: 'beebeebox_streamevents.xml',
      no_streamevents: 'kein Ereignis zu streamen',
      generated_streamevents: 'Die Datei "{0}" wurde generiert.',
      no_project: 'Kein Projekt geladen, dass in eine BeeBee Box Datei konvertiert werden kann'
    }
  },
  frontend: {
    error: {
      formatNotSupported: 'A/V FORMAT WIRD NICHT UNTERSTÜTZT',
      connection: 'Konnte keine Verbindung zum Server herstellen / die Verbindung wurde abgebrochen.',
      unidentified: 'Nicht identifizierter Fehler', // by DAE 1.1 p. 263:
      resource: 'Unvollständige Ressourcen',
      corrupt: 'Inhalte fehlerhaft oder ungültig',
      available: 'Inhalte sind nicht verfügbar',
      positition: 'Inhalte sind zur angegebenen Position nicht verfügbar',
      blocked: 'Der Inhalt ist nicht verfügbar auf Grund seitenübergeordneter Kontrolle' // (by ETSI 1.2.1)
    },
    state: {
      stopped: 'GESTOPPT',
      playing: 'SPIELT',
      paused: 'PAUSIERT',
      connected: 'VERBINDET SICH',
      buffering: 'PUFFERT',
      finished: 'BEENDET'
    },
    video360: {
      error: 'Fehler',
      deviceNotSupported: 'Ihr Gerät wird nicht unterstützt.',
      errSyncPlayPos: 'Die aktuelle Abspielposition wurde bereits berichtet. Es scheint, der Player spielt nicht.',
      errInvJson: 'ungültiges json vom Server erhalten',
      errConfig: 'ungültiges Konfigurationsobjekt. Zumindest die config.gatewayUrl muss gesetzt sein.'
    }
  }
};
module.exports = de;
