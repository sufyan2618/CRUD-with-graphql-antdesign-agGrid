import User from '../models/user.model.js';

const resolvers = {
    Query: {
        users: async (_, { page = 1, limit = 20, filter, sort }) => {
            const filterQuery = {};
            if (filter) {
                if (filter.email) filterQuery.email = { $regex: filter.email, $options: 'i' };
                if (filter.role) filterQuery.role = filter.role;
            }
            const sortQuery = {};
            if (sort && sort.field && sort.order) {
                sortQuery[sort.field] = sort.order === 'asc' ? 1 : -1;
            } else {
                sortQuery.creationDate = -1; 
            }
            const items = await User.find(filterQuery)
                .sort(sortQuery)
                .skip((page - 1) * limit)
                .limit(limit);

            const totalCount = await User.countDocuments(filterQuery);
            if (!items) {
                throw new Error('No users found');
            }
            return { items, totalCount, totalPages: Math.ceil(totalCount / limit)};
        },
    },
    Mutation: {
        createUser: async (_, {name, email, role, status}) => {
            const user = new User({ name, email, role, status });
            await user.save();
            return user;
        },
        updateUser: async (_, { id, name, email, role, status }) => {
            const user = await User.findByIdAndUpdate(
                id,
                { name, email, role, status },
                { new: true }
            );
            return user;
        },
        deleteUser: async (_, { id }) => {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        },
    },

}
export default resolvers;