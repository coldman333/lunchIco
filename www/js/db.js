

function FavoriteService($q) {  
    var _db;    

    // We'll need this later.
    var _favorit;


    function addFavorit(favorit) {  
      return $q.when(_db.post(favorit));
    };

   

    function updateFavorit(favorit,docID ) {  
    return $q.when(_db.put(favorit,docID));
   };


   function deleteFavorit(favorit) {  
    return $q.when(_db.remove(favorit));
};

function initDB() {
        // Creates the database or opens if it already exists
        _db = new PouchDB('favorit', {adapter: 'websql'});
};


function getAllFavorits() {  
    if (!_favorit) {
       return $q.when(_db.allDocs({ include_docs: true}))
            .then(function(docs) {

                // Each row has a .doc object and we just want to send an 
                // array of birthday objects back to the calling controller,
                // so let's map the array to contain just the .doc objects.
                _favorit = docs.rows.map(function(row) {
                    // Dates are not automatically converted from a string.
                    row.doc.Date = new Date(row.doc.Date);
                    return row.doc;
                });

                // Listen for changes on the database.
                _db.changes({ live: true, since: 'now', include_docs: true})
                   .on('change', onDatabaseChange);

                return _favorit;
            });
    } else {
        // Return cached data as a promise
        return $q.when(_favorit);
    }
};

// Binary search, the array is by default sorted by _id.
function findIndex(array, id) {  
    var low = 0, high = array.length, mid;
    while (low < high) {
    mid = (low + high) >>> 1;
    array[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
}

function onDatabaseChange(change) {  
    console.log(change)
    var index = findIndex(_favorit, change.id);
    var favorit = _favorit[index];

    if (change.deleted) {
        if (favorit) {
            _favorit.splice(index, 1); // delete
        }
    } else {
        if (favorit && favorit._id === change.id) {
            _favorit[index] = change.doc; // update
        } else {
            _favorit.splice(index, 0, change.doc) // insert
        }
    }
}


     return {
        initDB: initDB,

        // We'll add these later.
        getAllFavorits: getAllFavorits,
        addFavorit: addFavorit,
        updateFavorit: updateFavorit,
        deleteFavorit: deleteFavorit
    };
}
