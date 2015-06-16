'use strict';

/**
* Manage game's logic.
* Must inherit from Core.Game.
* @constructor
*/
Kafkaf.Game = function()
{
    this.sceneManager   = new Core.SceneManager();
    this.entityManager  = new Core.EntityManager();
}

/**
* Init.
* @return True if everything is ok.
*/
Kafkaf.Game.prototype.init = function()
{
    return true;
};

/**
* Entry point.
* @param deltaTime A floating value representing the time elapsed since the last update.
*/
Kafkaf.Game.prototype.update = function( deltaTime )
{
    this.sceneManager.update(deltaTime);
    this.entityManager.update(deltaTime);
};

/**
* Call on an event.
* @param event An Event instance. 
*/
Kafkaf.Game.prototype.onEvent = function( event )
{
    switch(event.type)
    {
        case Core.Event.Type.KeyDown:
        {
            switch(event.key)
            {
                case 38: // Up
                    break;
                case 40: // Down
                    break;
                case 37: // Left
                    break;
                case 39: // Right
                    break;
                default:
                    break;
            }
        }
        default:
            break;
    }
};