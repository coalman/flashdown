'use strict';

angular.module('app')
  .factory('deck', function () {
    
    return {
      name: "name",
      description: "description",
      cards: [
        { front: 'first1', back: 'the back' },
        { front: 'second2', back: 'the back' }
      ],
      addCard: function(f, b) {
        this.cards.push({
          front: f,
          back: b
        });
      },
      loadJson: function(json) {
        
      }
    };
  });
