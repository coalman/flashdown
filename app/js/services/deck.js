'use strict';

angular.module('flashcard.mdApp')
  .factory('deck', function () {
    
    return {
      name: "name",
      description: "description",
      cards: [{ front: "", back: "" }],
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
