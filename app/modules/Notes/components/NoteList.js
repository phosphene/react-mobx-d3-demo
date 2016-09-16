import React from 'react';
import { observer } from 'mobx-react';
import AddNote from './AddNote';
import Note from './Note';


export default observer(function NoteList({ store }) {
  return (
    <section>
      {store.notes.map((note, idx) => (
        <Note note={note} key={note.id} store={store} idx={idx} />
      ))}
      <AddNote store={store} />
    </section>
  );
});
