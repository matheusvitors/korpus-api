import { ValidationError } from "@/application/errors";
import { Repository } from "@/application/interfaces"
import { Relation } from "@/application/interfaces/relation";
import { newID } from "@/infra/adapters/newID";
import { conflict, created, notFound, serverError, unprocessableEntity } from "@/infra/adapters/response-wrapper";


interface CreateControllerParams<T> {
	repository: Repository<T>;
	input: T;
	// uniqueFields?: Array<keyof T>
	validate: (input: T) => void;
	relations?: Relation<any>[];
}

export const createController = async <T>(params: CreateControllerParams<T>) => {
	try {

		const { input, repository, validate, relations } = params;

		const finalInput = {...input, id: newID()}

		// if(uniqueFields) {
		// 	const filterParams: FilterParams<D>[] = uniqueFields.map<FilterParams<D>>(field => ({ field, value: finalInput[field]}))

		// 	const result = repository.filter && await repository.filter(filterParams);

		// 	if(result && result.length > 0) {
		// 		return conflict()
		// 	}
		// }

		if(relations){
			for(const relation of relations) {

				const savedItem = await relation.repository.get(relation.id);

				if(!savedItem){
					return notFound(relation.errorMessage)
				}
			}
		}

		validate(finalInput);
		await repository.create(finalInput);

		return created();
	} catch (error: any) {
		if(error instanceof ValidationError) {
			return unprocessableEntity(error.message);
		}
		return serverError(error);
	}
}
