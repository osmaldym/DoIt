import { useReducer } from "react";
import { TagModel } from "../api/models/tag";

type tagSelected = {
    tags?: TagModel | TagModel[],
    deselect?: boolean,
}

export const useSelectTagsReducer = () => useReducer(
    (prev: TagModel[], tagSelected: tagSelected) => {
        if (Array.isArray(tagSelected.tags)) {
            if (tagSelected.deselect){
                const sTags = tagSelected.tags! as TagModel[];
                const filtered = prev.filter((tag: TagModel) =>
                    sTags.find((sTag: TagModel) => sTag._id! !== tag._id!)
                );
                return filtered.length ? filtered : prev;
            }

            return prev.concat(tagSelected.tags);
        }

        const tagAlone = tagSelected.tags as TagModel;

        if (!tagAlone._id) return prev;
        
        if (tagSelected.deselect){
            const sTag = tagSelected.tags! as TagModel;
            const filtered = prev.filter((tag: TagModel) => tag._id !== sTag._id!);
            return filtered;
        }

        const noExist = !prev.find((tag: TagModel) => tag._id === tagAlone._id);

        return noExist ? prev.concat(tagSelected.tags!) : prev;
    }, []
);