import { ValidationError } from "@/application/errors";
import { FilterParams, Repository, Relation, ResponseData, OwnerRelation } from "@/application/interfaces";
import { success, unprocessableEntity, serverError, notFound, conflict, forbbiden } from "@/infra/adapters/response-wrapper";

interface EditControllerParams<T> {
	repository: Repository<T>;
	input: T & {id: string};
	uniqueFields?: Array<keyof Omit<T, 'id'>>
	validate: (input: T) => void;
	relations?: Relation<any>[];
	owner?: OwnerRelation<T>;
}

export const editController = async <T>(params: EditControllerParams<T>): Promise<ResponseData> => {

	try {
		const {input, repository, uniqueFields, validate, relations, owner} = params;

		if(!input.id) {
			return unprocessableEntity('O id da conta é obrigatório.')
		}

		validate(input);

		const data = await repository.get(input.id);

		if(!data) {
			return notFound();
		}

		if(owner){
			if(data[owner.field as keyof T] !== owner.id){
				return forbbiden()
			}
		}

		if(relations){
			relations.forEach(async relation => {
				const savedItem = await relation.repository.get(relation.id);
				console.log(relation.id, savedItem);

				if(!savedItem){
					return notFound();
				}
			})
		}

		const changedUniqueFields: Array<keyof T> = [];

		if(uniqueFields) {
			const dataAsT = data as T;
			for (const field of uniqueFields) {
				if(input[field] !== dataAsT[field]){
					changedUniqueFields.push(field);
				}
			}
		}

		if(changedUniqueFields.length > 0){
			const filterParams: FilterParams<T>[] = changedUniqueFields.map<FilterParams<T>>(field => ({ field, value: input[field]}))

			const result = await repository.filter!(filterParams);
			if(result) {
				return conflict()
			}

		}
		await repository.edit(input)
		return success();

	} catch (error) {
		if(error instanceof ValidationError) {
			return unprocessableEntity(error.message);
		}
		return serverError(error);
	}
}
