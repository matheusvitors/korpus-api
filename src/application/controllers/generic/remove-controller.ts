import { OwnerRelation, Repository, ResponseData } from "@/application/interfaces";
import { notFound, success, serverError, forbbiden } from "@/infra/adapters/response-wrapper";

interface RemoveControllerParams<T> {
	repository: Repository<T>;
	id: string;
	owner?: OwnerRelation<T>;
}

export const removeController = async <T>(params: RemoveControllerParams<T>): Promise<ResponseData> => {
	try {
		const { id, repository, owner } = params;
		const data = await repository.get(id);

		if(!data) {
			return notFound();
		}

		if(owner){
			if(data[owner.field as keyof T] !== owner.id){
				return forbbiden()
			}
		}

		await repository.remove(id);
		return success(data);
	} catch (error) {
		return serverError(error)
	}
}
