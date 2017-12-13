/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lancaster University, Leadin, RBB, Mediaset
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
 * original dutch l10n file
 */
const nl = {
  appMgr: {
    exclude: 'Exclude',
    navModels: {
      slideflow: 'Met de SlideFlow-navigatie kunt u als content creator volledige schermpagina\'s opmaken en de volgorde opgeven waarin ze worden gepresenteerd. De gebruikerservaring lijkt op het doorzoeken van een diapresentatie. <br />Hoewel pagina\'s selecteerbare HotSpots kunnen bevatten om extra inhoud en informatie te geven die betrekking heeft op de momenteel gepresenteerde pagina, is de navigatie tussen de afzonderlijke pagina\'s opeenvolgend, waardoor de content creator een verhaallijn kan vertellen.',
      timeline: 'Event-based navigatie maakt het mogelijk om de presentatie van HbbTV-inhoud door het uitzendprogramma te laten leiden. Het meest voorkomende voorbeeld is de presentatie van de "Rode Knop" bij het begin van een TV-programma of advertentie om de kijker erop te attenderen dat er extra informatie beschikbaar is. Terwijl het uiterlijk van de knop meestal wordt geactiveerd door MPEG-stream gebeurtenissen kunnen alternatieve kanalen, bijv. Web sockets of applicatie pull-requests, ook gebruikt worden. <br/> Event-based navigatie is het beste geschikt voor kleine informatie-inserts.',
      website: 'Dit model wordt meestal gebruikt voor HbbTV apps. Van een bestemmingspagina krijgen gebruikers toegang tot extra inhoud door op de schermknoppen te kiezen met de pijltjestoetsen - vergelijkbaar met een website. Vaak kunnen ook de snelkoppelingskleur- / numerieke toetsen worden gebruikt. <br /> Hoewel dit model gebruikelijk is, is het niet goed geschikt voor digitale verhalen, aangezien het gebruikerspad willekeurig is. Daarom moet elke pagina op zichzelf staan.'
    }
  },
  navModel: {
    sampleApp: 'Voorbeeld applicatie',
    components: 'Componenten'
  },
  componentLoader: {
    containerTitle: {
      label: 'Container stijlen'
    },
    fontSize: {
      label: 'Lettertypegrootte',
      placeholder: 'Grootte in px'
    },
    fontWeight: {
      label: 'Tekst Gewicht',
      placeholder: 'getal van 100 tot 900'
    },
    border: {
      label: 'Rand',
      placeholder: 'css border notation (e.g.: 1px solid #000)'
    },
    borderRadius: {
      label: 'Randstraal',
      placeholder: 'size in px'
    },
    margin: {
      label: 'Margin',
      placeholder: 'size in px'
    },
    padding: {
      label: 'Padding',
      placeholder: 'size in px'
    },
    color: {
      label: 'Text Color'
    },
    backgroundColor: {
      label: 'Achtergrond kleur'
    }
  },
  formTypes: {
    fontSize: {
      label: 'Font Size',
      placeholder: '14pt'
    },
    fontWeight: {
      label: 'Tekst Gewicht',
      placeholder: 'number form 100 to 900'
    },
    border: {
      label: 'Rand',
      placeholder: '1px solid #000'
    },
    borderRadius: {
      label: 'Randstraal',
      placeholder: '5px'
    },
    margin: {
      label: 'Marge',
      placeholder: '0px'
    },
    padding: {
      label: 'Vulling',
      placeholder: '0px'
    },
    color: {
      label: 'Tekstkleur',
      placeholder: 'notatie: rgb(), rgba(), # & kleur naam'
    },
    backgroundColor: {
      label: 'Achtergrond kleur',
      placeholder: 'notatie: rgb(), rgba(), # & kleur naam'
    }

  },
  componentStateSelector: {
    enter: 'Zet in gang wanneer u op dit item drukt',
    focus: 'Zet in gang wanneer het item is gericht',
    chooseAnAction: 'Kies een actie',
    assetFinderPlaceholder: 'Typ asset naam'
  },
  pageSelector: {
    loading: 'LADEN',
    select: 'KIES',
    noTitle: 'geen titel',
    error: 'FOUT'
  },
  styles: {
    choose: 'Kies',
    typeUrlOrSelectMedia: 'Typ url of selecteer media'
  },
  stylesPopup: {
    done: 'Klaar'
  },
  textSubmit: {
    ok: 'OK'
  },
  hotSpotEdit: {
    edit: 'bewerk',
    title: 'Hot Spot Pictogram',
    active: 'Actief',
    background: 'Achtergrond',
    icon: 'Pictogram',
    orCustomFile: 'Of aangepast bestand',
    focused: 'gericht',
    normal: 'normaal',
    iconColour: 'Pictogram kleur',
    contentPosition: 'Content Positie',
    location: 'Locatie',
    overTheIcon: 'Over het pictogram',
    underTheIcon: 'Onder het pictogram',
    static: 'Absoluut / statisch',
    staticContentPosition: 'Statische content positie',
    top: 'Boven',
    left: 'Links',
    contentSize: 'Content Grootte (px)',
    width: 'Breedte',
    height: 'Hoogte',
    ifEmptyFitContent: 'Indien leeg, past het bij de content',
    keyBinding: 'Key Binding',
    done: 'Klaar',
    or: 'OF',
    defaultIfAvailable: 'Standaard, indien beschikbaar',
    customIcon: 'Aangepast pictogram',
    choose: 'Kies',
    selectRemoteButton: 'Selecteer de afstandsbedieningsknop'

  },
  imageCropper: {
    cropRatio: 'Uitsnijden afbeeldinging naar verhouding',
    cropImage: 'Uitsnijden afbeeldinging',
    restore: 'Herstellen',
    crop: 'Uitsnijden',
    free: 'Vrij'
  },
  layoutBuilder: {
    unused: 'ongebruikt',
    returnToPageEditor: 'TERUG NAAR DE PAGINA EDITOR',
    save: 'BEWAREN',
    layoutBuilder: 'Layout Builder',
    width: 'Breedte',
    height: 'Hoogte',
    left: 'Links',
    top: 'Boven',
    layoutTitle: 'Layout Titel',
    placeholderTitle: 'Voer hier de titel in',
    previewBackground: 'Achtergrond Voorbeeld',
    placeholderBg: 'TYP URL OF RGB',
    selectFile: 'Kies bestand',
    addAnotherBox: 'Voeg een andere box toe',
    add: 'Toevoegen',
    showSafeArea: 'Toon veilige zone',
    showGridLines: 'Toon rasterlijnen',
    layoutUsedInPages: 'Lay-out gebruikt in pagina\'s'
  },
  undoRedo: {
    undo: 'ongedaan maken',
    redo: 'overdoen'
  },
  gallery: {
    removeImage: 'Verwijder afbeelding',
    gallerySettings: 'Galerij instellingen',
    orientation: 'oriëntering',
    horizontal: 'Horizontaal',
    vertical: 'Verticaal',
    imageCover: 'Afbeeldingdeksel',
    zoomToFit: 'Afbeeldinging passend aan container maken',
    autoPlay: 'Automatisch afspelen',
    ms: 'milliseconden',
    repeat: 'Herhaal',
    loop: 'Lus',
    useMediaKeys: 'Gebruik MediaKey',
    dots: 'Punten',
    arrows: 'Pijlen',
    chooseImages: 'Kies afbeeldingen',
    clearSelections: 'Wis Selecties',
    noImages: 'Geen afbeeldingen',
    closeCropEditor: 'Close crop editor'
  },
  stateEditor: {
    title: 'Component Bewerker',
    stateManagement: 'Staatsmanagement',
    saveAsTemplate: 'Sla op als sjabloon'
  },
  pageModelCreator: {
    chooseCustomBox: 'Kies aanpasbare dozen',
    boxNb: 'Doos Nr.',
    isItEditable: 'Bewerkbaar',
    editableOrStyles: 'Bewerkbare stijlen',
    addOrRemoveFromAllowedTypes: 'Toevoegen of verwijderen van toegestane types',
    allowedTypes: 'Toegestane typen',
    compontentTypeToAddOrRemove: 'Component type om toe te voegen of te verwijderen',
    any: 'Ieder',
    cancel: 'Annuleer',
    create: 'Creëren'
  },
  pageEditor: {
    title: 'Pagina Editor',
    pageTitle: 'Pagina titel',
    pageLink: 'Pagina link',
    pageLayout: 'Pagina Opmaak',
    pageParent: 'Pagina Ouder',
    pageStyles: 'Pagina Stijlen',
    pageBg: 'Pagina achtergrond',
    scheduleUpdate: 'Plan een update',
    unsavedChanges: 'U heeft ongestoorde wijzigingen',
    untitled: 'Onbeschreven',
    errorWhileSaving: 'Fout bij het opslaan',
    confirmLeave: 'U heeft ongestoorde wijzigingen, wilt u de pagina echt verlaten?',
    chooseBgColor: 'Kies achtergrondkleur',
    showHide: 'Laten zien / Verbergen',
    or: 'of',
    movedToStyle: 'Pagina achtergrondkleur en media zijn verplaatst naar pagina stijlen',
    createModelFromPage: 'Maak model van pagina',
    changeStyles: 'Verander stijlen',
    file: 'Bestand',
    create: 'Creër',
    pageFromModel: 'Pagina gemaakt van Model',
    quickLink: 'Snelle naar',
    saveModelInstance: 'Opslaan model instance',
    savePage: 'Bewaar pagina',
    duplicate: 'Duplicaat',
    editLayout: 'Bewerk Opmaak',
    typeUrlOrRgb: 'Type URL of RGB waarde',
    noParent: 'Geen ouder'
  },
  componentEditor: {
    editComponentStyle: 'Componentstijlen bewerken',
    editInner: 'Bewerk...',
    titleComponentStyle: 'Componentstijl',
    componentLabel: 'Component Label',
    componentType: 'Component Type',
    chooseView: 'Kies weergave',
    hideFocus: 'Focus verbergen',
    navigable: 'bevaarbaar',
    scrollable: 'Scrollable',
    hotSpot: 'Hot Spot',
    companionScreen: 'Companion Screen',
    thisIsAModel: 'Dit is een model',
    editProtected: 'Bewerking is uitgeschakeld',
    editStubborn: 'Bewerk in ieder geval'
  },
  audio: {
    title: 'Geluidsinstellingen',
    audioUrlInput: 'Bron bestand',
    audioUrlLabel: 'Bron bestand',
    autoStart: 'Automatische start',
    chooseFile: 'Kies bestand',
    whenPageLoads: 'Wanneer de pagina laadt',
    repeat: 'Herhaal',
    loop: 'Lus'
  },
  broadcast: {
    notice1: 'De broadcast component toont het uitzendingsignaal op de TV.',
    notice2: 'Als u deze gebruikt op een desktopcomputer',
    notice3: 'of verwant, zal de component zwart blijven.'
  },
  clone: {
    choose: 'Kies',
    modelComponentPage: 'Model component pagina',
    layoutBox: 'Opmaak doos',
    component: 'Component'
  },
  image: {
    title: 'Beeldinstellingen',
    url: 'Afbeelding URL',
    upload: 'Afbeelding uploaden',
    chooseFromLibrary: 'Of kies uit de bibliotheek',
    choose: 'Kies'
  },
  launcher: {
    backend: {
      launcherSettings: 'Launcher instellingen',
      toLinkAPage: 'Als u wilt koppelen aan een specifieke pagina van dit onderdeel, voegt u het volgende toe aan uw link',
      menuOrient: 'Menu Oriëntatie',
      horizontal: 'Horizontaal',
      vertical: 'Verticaal',
      format: 'Launcher-indeling',
      landscape: 'Landschap',
      square: 'Vierkant',
      squareWithInfo: 'Vierkant met info',
      portrait: 'Portret',
      launcherStyle: 'Launcher stijl',
      optionStandard: 'Standaard',
      optionArte: 'Arte TV',
      scrollStyle: 'Scroll stijl',
      optionCarousel: 'Carrousel',
      optionPagination: 'Paginering',
      showPaginationInfo: 'Toon paginering info',
      addLauncherElement: 'Launcher-element toevoegen',
      launcherThumbnail: 'Launcher Thumbnail',
      launcherThumbnailUrl: 'Launcher Thumbnail URL',
      chooseThumbnail: 'Kies Thumbnail',
      title: 'Titel',
      launcherTitle: 'Launcher Titel',
      role: 'Rol',
      link: 'Link',
      controlTargetComponent: 'Controle Doelcomponent',
      chooseTargetFirst: 'Kies doel eerst!',
      launcherTargetUrl: 'Launcher Doel URL',
      pages: 'Paginas',
      state: 'Staat',
      description: 'Beschrijving',
      launcherDescription: 'Launcher Beschrijving',
      deleteLauncherElement: 'Verwijder Launcher Element',
      optionalContentIcon: 'Optioneel inhouds icoon',
      none: 'geen',
      audio: 'audio',
      picture: 'beeld',
      text: 'tekst',
      video: 'video'
    },
    frontend: {
      monthNames: [
        'JANUARI', 'FEBRUARI',
        'MAART', 'APRIL',
        'MEI', 'JUNI',
        'JULI', 'AUGUSTUS',
        'SEPTEMBER', 'OCTOBER',
        'NOVEMBER', 'DECEMBER'
      ],
      dayNames: [
        'ZONDAG',
        'MAANDAG',
        'DINSDAG',
        'WOENSDAG',
        'DONDERDAG',
        'VRIJDAG',
        'ZATERDAG']
    }
  },
  link: {
    linkSettings: 'Link instellingen',
    linkImageUrl: 'Link afbeelding URL',
    placeHolderLinkImageUrl: 'Link afbeelding URL',
    chooseLinkImage: 'Kies link afbeelding',
    linkLabel: 'Link Label',
    placeHolderLinkLabel: 'LINK LABEL',
    or: 'of',
    linkTarget: 'Link doel',
    placeHolderLinkUrl: 'LINK URL',
    pages: 'Paginas',
    imageLayoutCover: 'Afbeelding opmaak omslag'
  },
  list: {
    listSettings: 'List Settings',
    addListElement: 'Voeg lijstelement toe',
    title: 'Titel',
    placeHolderTitle: 'ELEMENT TITEL',
    url: 'URL',
    placeHolderUrl: 'ELEMENT DOEL URL',
    description: 'Beschrijving',
    placeHolderDesc: 'ELEMENT BESCHRIJVING',
    deleteListElement: 'Verwijder lijst element'
  },
  menu: {
    menuSettings: 'Menu instellingen',
    addMenuItem: 'Menu-item toevoegen',
    title: 'Titel',
    sideMenu: 'Zijmenu',
    showAsSideMenu: 'Toon menu als zijmenu',
    menuOrient: 'Menu Oriëntatie',
    horizontal: 'Horizontaal',
    vertical: 'Verticaal',
    loop: 'Lus',
    restart: 'Of de navigatie opnieuw moet starten vanaf het eerste item na de laatste (en viceversa) of niet',
    showButtons: 'Toon knoppen',
    showRemoteKeys: 'Toon afstandsbedieningen',
    selectAction: 'Selecteer Actie',
    goToPrevPage: 'Ga naar vorige pagina',
    toggleApplication: 'Wissel applicatie (toon/verberg)',
    label: 'Label',
    placeHolderLabel: 'MENU TEKST',
    remoteKey: 'Afstandsknop',
    remoteControlKey: 'Control afstandsknop',
    role: 'Rol',
    link: 'Link',
    controlApplication: 'Controle Applicatie',
    controlTargetComponent: 'Controle doelcomponent',
    launchAppViaAIT: 'Start applicatie via AIT',
    url: 'URL',
    placeHolderUrl: 'TARGET URL',
    pages: 'Paginas',
    appId: 'App ID',
    fallbackUrl: 'Terugval URL',
    appAction: 'Applicatieactie',
    state: 'Staat',
    deleteItem: 'Verwijder menu-item',
    addItem: 'Voeg menu-item toe'
  },
  redbutton: {
    redButtonSettings: 'Rode knop instellingen',
    buttonImage: 'Knopbeeld',
    placeHolderImageUrl: 'BEELD URL',
    chooseImage: 'Kies Beeld',
    redButtonLink: 'Roke knop link',
    placeHolderRedButtonLink: 'LINK URL',
    fadeInTime: 'Vervagingstijd (s)',
    placeHolderFadeInTime: 'SECONDEN',
    displayDuration: 'Weergaveduur (s)',
    placeHolderDisplayDuration: 'SECONDEN'
  },
  scribbleLive: {
    noPreviewAvailable: 'ScribleLive Feed. Geen specifiek voorbeeld beschikbaar.',
    title: 'Scribble Live',
    hint1: 'Hint: gebruik alstublieft',
    hint2: 'voor taalinstellingen. (om informatie over timer-informatie weer te geven',
    hint3: 'van een jaar geleden'

  },
  scrolledText: {
    title: 'Gescrolde tekst instellingen',
    arrowColor: 'Pijlkleur',
    activeArrowColor: 'Actieve pijl kleur',
    arrowPlacement: 'Pijl Plaatsing',
    onText: 'op tekst',
    left: 'links',
    right: 'rechts',
    aboveBelow: 'boven/onder',
    outside: 'buiten',
    noArrows: 'geen pijlen'
  },
  toggleTracking: {
    title: 'De instellingen voor het volgen van de track aanpassen',
    enabledText: 'Geactiveerde tekst',
    disabledText: 'Uitgeschakelde tekst',
    button: 'Knop'
  },
  video: {
    title: 'Video-instellingen',
    asset: 'bezit',
    src: 'Videobron',
    placeHolderSrc: 'VIDEO URL',
    or: 'of',
    chooseVideo: 'Kies Video',
    thumbnail: 'Video Thumbnail',
    placeHolderThumbnail: 'THUMBNAIL URL',
    chooseThumbnail: 'Kies Thumbnail',
    autoPlay: 'Automatisch afspelen',
    startPlaybackWhenPage: 'Begin afspelen als de pagina opent',
    repeat: 'Herhaling',
    loop: 'Lus',
    fullscreenStart: 'Volledig scherm starten',
    startVideoFullScr: 'Start video in fullscreen',
    removeBlackBars: 'Verwijder zwarte balken',
    zoomVideo: 'Zoem video in om zwwarte balken te verwijderen',
    playIcon: 'Speel icoon',
    showPlayIcon: 'Toon speel icoon wanneer de video klaar is',
    showNavBar: 'Toon navigatiebalk'
  },
  timeline: {
    title: 'Tijdlijn',
    range: 'Be; reik',
    duration: 'Duur (sec)',
    fps: 'Beelden per seconde',
    select_range: 'Please select a range',
    editting_range: 'Editting range {0}',
    no_selection: 'No time range currently selected',
    new_project: 'Nieuw projekt {0}',
    existing_project: 'Herstellen mogelijk: Er bestaat reeds een projekt genaamd "{0}"',
    restore: {
      button: { value: 'Herstellen' },
      wait: 'Wacht {0} seconden.',
      skipload: ' (laatste herstelling was {0} seconden geleden om {1})',
      scenario_loaded: 'Scenario voor {0} met {1} evenementen publiceerd om {2}',
      nothing_to_restore: 'Niets te herstellen',
      restored: '{0} gerestaureerde evenementen.',
      no_overwrite: 'Behoudt van huidige werkomgeving',
      ask_to_overwrite: 'Huidige werkomgeving overschrijven?'
    },
    publish: {
      button: {
        value: 'Publiceren'
      },
      publishing: 'Publicatie...',
      no_ovewrite: 'Publicatie wordt overgeslagen om gegevensverlies te voorkomen',
      warning_overwrite: 'WAARSCHUWING:\nDit zal uw huidige scenario voor \'{0}\' overschrijven.\n\nVerder' +
      ' met het publiceren?',
      wait: 'Wacht {0} seconden.',
      saved: ' (bewaard {0}s geleden om {1})',
      notsaving: 'Niet bewaren: Scenario is leeg',
      scenario_published: '{0} scenario met {1} event(s) is gepubliceerd om {2}'
    },
    remove: {
      button: {
        value: 'Publiceren'
      },
      deleting: 'Publicatie...',
      no_ovewrite: 'Publicatie wordt overgeslagen om gegevensverlies te voorkomen',
      warning_overwrite: 'WAARSCHUWING:\nDit zal uw huidige scenario voor \'{0}\' overschrijven.\n\nVerder' +
      ' met het publiceren?',
      wait: 'Wacht {0} seconden.',
      saved: ' (bewaard {0}s geleden om {1})',
      notsaving: 'Niet bewaren: Scenario is leeg',
      scenario_deleted: '{0} scenario met {1} event(s) is gepubliceerd om {2}'
    },
    rangeEdit: {
      button: {
        value: 'Maak bewerkbaar',
        title: 'Ververs en/of maak het tijdsbestek bewerkbaar'
      },
      button2: {
        value: 'Wissel selecties',
        title: 'Wissel het geselecteerde tijdsbestek met degene rechts'
      },
      event: {
        type: 'Type',
        keycode: 'KeyCode',
        data: 'Data',
        begin: 'Begin',
        dura: 'Duur'
      },
      eventOptions: {
        streamEvent: 'StreamEvent',
        keyEvent: 'KeyEvent',
        mediaEvent: 'MediaEvent',
        timeEvent: 'TimeEvent',
        clockEvent: 'ClockEvent'
      },
      time: 'Tijd',
      page: 'Pagina'
    },
    rangeRemove: {
      button: {
        value: 'Verwijder selectie',
        title: 'Verwijder het geselecteerde tijdsbestek'
      }
    },
    rangeTool: {
      range: 'Evenementen bewerken',
      swapButton: {
        value: 'Wissel',
        title: 'Wissel geselecteerd bereik naast rechts'
      }
    },
    restoreButton: {
      error: 'Fout bij het laden van het scenario'
    },
    timelineEditor: {
      error: { unableToSet: 'Waarschuwing: niet in staat om waarde in te stellen' }
    },
    dsmcc: {
      title: 'DSMCC Events XML generator',
      button: {
        link: 'DSMCC',
        title: 'Download een DSMCC geformatteerde XML voor stream events'
      },
      fileName: 'dsmcc.xml',
      seID: {
        label: 'StreamEvent ID',
        title: 'StreamEvent ID (1-65535)'
      },
      seName: {
        label: 'StreamEvent Naam',
        title: 'StreamEvent Naam (TXT)'
      },
      seComponentTag: {
        label: 'Component Tag',
        title: 'Component Tag (1-255)'
      }
    }
  },
  frontend: {
    error: {
      formatNotSupported: 'Audio/Video formaat wordt niet ondersteund',
      connection: 'Kan geen verbinding maken met de server of de verbinding die is verloren',
      unidentified: 'Niet geïdentificeerde fout', // by DAE 1.1 p. 263:
      resource: 'Onvoldoende middelen',
      corrupt: 'Inhoud corrupt of ongeldig',
      available: 'Inhoud niet beschikbaar',
      positition: 'Inhoud niet beschikbaar op een bepaalde positie',
      blocked: 'Inhoud niet beschikbaar als gevolg van ouderlijke controle' // (by ETSI 1.2.1)
    },
    state: {
      stopped: 'GESTOPT',
      playing: 'SPELEN',
      paused: 'GEPAUZEERD',
      connected: 'VERBINDING',
      buffering: 'BUFFERING',
      finished: 'BEËINDIGD'
    },
    video360: {
      error: 'Fout',
      deviceNotSupported: 'Uw apparaat wordt niet ondersteund.'
    }
  }
};

module.exports = nl;
