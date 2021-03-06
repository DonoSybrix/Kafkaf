goog.provide('Kafkaf.PlayerSystem');
goog.require('Kafkaf.Helpers.EntityBuilder');
goog.require('Kafkaf.Models.Configuration');
goog.require('ES.Utils');

/**
* Manage players.
* @extends {ES.System}
* @constructor
* @author Donovan ORHAN <dono.orhan@gmail.com>
*/
Kafkaf.PlayerSystem = function()
{
    ES.System.call(this);

    /**
    * Players.
    * @type {Array.<ES.Entity>}
    * @private
    */
    this.players = [];
}
ES.Utils.extend(ES.System, Kafkaf.PlayerSystem);

/**
* Call when the system is clear.
*/
Kafkaf.PlayerSystem.prototype.onClear = function() 
{
    this.players.length = 0;
};

/**
* Create a new player.
* @param {Kafkaf.Helpers.EntityBuilder} builder The entity builder.
* @param {string} name Name to assign.
* @param {Array.<number, number>} position Spawn position.
*/
Kafkaf.PlayerSystem.prototype.createPlayer = function( builder, name, position ) 
{
    var player = this.world.createEntity();

    player.setName(name);

    // Add the most important component.
    var transformable           = new Kafkaf.TransformComponent();
    transformable.position.x    = position[0];
    transformable.position.y    = position[1];
    player.addComponent(transformable);

    // Add character components.
    builder.buildEntityFromPrefab(player, "Character");

    // Controls (ToDo: use configuration file).
    var controllerData          = Kafkaf.Models.Configuration.getInstance().getController(this.players.length);
    var controllableComponent   = new Kafkaf.ControllableComponent();
    controllableComponent.setKey( Kafkaf.ControllableComponent.ControlType.Up, controllerData["jump"] );
    controllableComponent.setKey( Kafkaf.ControllableComponent.ControlType.Down, controllerData["action"] );
    controllableComponent.setKey( Kafkaf.ControllableComponent.ControlType.Left, controllerData["left"] );
    controllableComponent.setKey( Kafkaf.ControllableComponent.ControlType.Right, controllerData["right"] );
    player.addComponent( controllableComponent );

    // Default components.
    player.addComponent( new Kafkaf.LifeComponent( 1 ) );
    player.addComponent( new Kafkaf.MoveComponent() );
    player.addComponent( new Kafkaf.JumpComponent( 10, 2 ) );
    var collisionListener = new Kafkaf.CollisionListenerComponent();
    collisionListener[0] = "characterBegin";
    collisionListener[1] = "characterEnd";
    player.addComponent(collisionListener);

    this.players.push(player);
};

/**
* Call when an event is received.
* @param {ES.Event} event An ES.Event instance.
*/
Kafkaf.PlayerSystem.prototype.onEvent = function( event ) 
{
    if( event instanceof Kafkaf.Event.DeadEvent )
    {
        var index = -1;
        for( var i = 0; i < this.players.length; i++ )
            if( this.players[i] == event.victim )
                index = i;

        if( index > -1 )
            this.players.splice(index, 1);
    }
};

/**
* Get player count.
* @return {number} Player count.
*/
Kafkaf.PlayerSystem.prototype.getPlayerCount = function() 
{
    return this.players.length;
}

/**
* Indicate if the given entity is an entity controlled by a player.
* @param {ES.Entity} entity An ES.Entity intance.
* @return {boolean} True if the entity is a player.
*/
Kafkaf.PlayerSystem.prototype.isPlayer = function( entity ) 
{
    for( var i = 0; i < this.players.length; i++ )
        if( this.players[i] == entity )
            return true;

    return false;
}

