import {
  createNote,
  getNotesByUser,
  getNoteById,
  updateNotes,
} from "./notes.service.js";

export const createNoteController = async (req, res) => {
  try {
    const { title } = req.body;
    const context = req.body.context ?? req.body.content;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note title is required",
      });
    }

    if (!context || !context.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note context is required",
      });
    }

    const note = await createNote({
      userId: req.user.id,
      title,
      context,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: { note },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyNotesController = async (req, res) => {
  try {
    const notes = await getNotesByUser(req.user.id);

    return res.status(200).json({
      success: true,
      data: { notes },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyNotesById = async (req, res) => {
  try {
    const { notesId } = req.params;
    const note = await getNoteById({
      noteId: notesId,
      userId: req.user.id,
    });
    if(!note){
      return res.status(404).json({
        success : false,
        message : 'note not found'
      });
    }
    return res.status(200).json({
      success:true,
      data : {note}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateNotesController = async(req , res) =>{
  try{ 
    const {notesId} = req.params;
    const {title} = req.body;
    const context = req.body.context ?? req.body.content ;
    if(!title || !title.trim()){
      return res.status.json({
        success : false ,
        message : 'note title is required '
      });
    }
    if(!context || !context.trim()){
      return res.status.json({
        success :false ,
        message : 'note context is required'
      });
    }
    const updatedNotes = await updateNotes({
      noteId : notesId,
      userId : req.user.id,
      title ,
      context 
    });
    if(!updatedNotes){
      return res.status(404).json({
        success :false ,
        message : 'Note not found or you are not allowed to update it'
      })
    }
    return res.status(200).json({
      success : true ,
      message : 'note updated successfully ',
      data : {note : updateNotes}
    });
    
  }
  catch(error){
    return res.status(500).json({
      success: false ,
      message : error.message,
    });
  }
};
