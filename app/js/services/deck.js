'use strict';

app.factory('deck', function () {
    
    return {
      name: "name",
      description: "description",
      cards: [
        { front: 'first1', back: 'the back' },
        { front: 'second2', back: 'the back' }
      ]
    };
  });
