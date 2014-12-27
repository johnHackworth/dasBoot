window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var crewLayout = function(options) {
    this.stage = options.stage;
    this.world = options.world;
    this.player = this.world.player;
    this.init();
    window.crew = this;
  };
  crewLayout.prototype = {
    viewing: 'crew',
    init: function() {
      this.removables = [];
      this.mainContainer = new PIXI.DisplayObjectContainer();
      this.stage.addVisualEntity(this.mainContainer);
      this.addMapButton();
      if (this.viewing === 'crew') {
        this.addCrewList();
      } else if (this.viewing === 'sailors') {
        this.addAvailableSailorsList();
      }
      this.addSelectedView();
      this.addCrewTypeButtons();
    },
    isPlayerInAPort: function() {
      return this.player.sector.isPort;
    },
    clear: function() {
      while (this.removables.length) {
        var rem = this.removables.pop();
        if (rem.clear) {
          rem.clear();
        }
      }
      this.stage.removeEntity(this.mainContainer);
    },
    addMapButton: function() {
      this.mapViewButton = new window.boot.ui.Button({
        stage: this.stage,
        width: 200,
        action: function() {
          boot.mainDirector.startSectors();
        },
        x: boot.config.width - 230,
        y: 5,
        text: 'Map View',
        buttonImage: 'assets/buttons/metalButton.png'
      });
      this.removables.push(this.mapViewButton);
    },
    addCrewList: function() {
      this.crewContainer = new PIXI.DisplayObjectContainer();
      this.peopleList = new boot.ui.PeopleList({
        container: this.crewContainer,
        people: this.player.people,
        stage: this.stage,
        click: this.selectPerson.bind(this),
        x: 200,
        y: 0
      });
      this.removables.push(this.peopleList);
      this.mainContainer.addChild(this.crewContainer);
    },
    addAvailableSailorsList: function() {
      var port = this.player.sector.getPort();
      this.crewContainer = new PIXI.DisplayObjectContainer();
      this.peopleList = new boot.ui.PeopleList({
        container: this.crewContainer,
        people: port.people,
        stage: this.stage,
        click: this.selectPerson.bind(this),
        x: 200,
        y: 0
      });
      this.removables.push(this.peopleList);
      this.mainContainer.addChild(this.crewContainer);
    },
    selectPerson: function(personModel) {
      this.selectedView.changeTarget(personModel);
    },
    addSelectedView: function() {
      this.selectedViewContainer = new PIXI.DisplayObjectContainer();
      this.selectedView = new window.boot.ui.SelectedCrewView({
        stage: this.stage,
        player: this.player,
        x: 0,
        y: 130,
        container: this.selectedViewContainer
      });
      this.removables.push(this.selectedView);
      this.mainContainer.addChild(this.selectedViewContainer);
    },
    addCrewTypeButtons: function() {

      this.viewCrewButton = new window.boot.ui.Button({
        stage: this.stage,
        width: 150,
        height: 30,
        fontSize: '12px',
        action: this.viewCrew.bind(this),
        x: 10,
        y: 5,
        baseTint: this.viewing === 'crew' ? 0xAACC66 : 0xFFFFFF,
        text: 'Your Crew',
        buttonImage: 'assets/buttons/metalButton.png'
      });
      this.removables.push(this.viewCrewButton);
      if (this.isPlayerInAPort()) {
        this.viewFreeSailorsButton = new window.boot.ui.Button({
          stage: this.stage,
          width: 150,
          height: 30,
          fontSize: '12px',
          action: this.viewAvailableSailors.bind(this),
          x: 10,
          y: 45,
          baseTint: this.viewing === 'sailors' ? 0xAACC66 : 0xFFFFFF,
          text: 'Available Sailors',
          buttonImage: 'assets/buttons/metalButton.png'
        });
        this.removables.push(this.viewFreeSailorsButton);
      }
    },
    viewCrew: function() {
      this.viewing = 'crew';
      this.clear();
      this.init();
    },
    viewAvailableSailors: function() {
      this.viewing = 'sailors';
      this.clear();
      this.init();
    }

  };
  window.boot.ui.CrewLayout = crewLayout;
})();