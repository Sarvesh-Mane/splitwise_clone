package serviceimpl;

import io.ebean.Finder;
import io.ebean.Model;
import services.BaseService;

import java.util.List;
import java.util.Optional;

public abstract class BaseServiceImpl<T extends Model, ID> implements BaseService<T, ID> {

    protected final Finder<ID, T> finder;

    public BaseServiceImpl(Finder<ID, T> finder) {
        this.finder = finder;
    }

    //base service interface ke methods implement karo

    @Override
    public T save(T entity) {
        entity.save();
        return entity;
    }

    @Override
    public Optional<T> findById(ID id) {
        return Optional.ofNullable(finder.byId(id));
    }

    @Override
    public List<T> findAll() {
        return finder.all();
    }

    @Override
    public T update(T entity) {
        entity.update();
        return entity;
    }

    @Override
    public void delete(ID id) {
        T entity = finder.byId(id);
        if (entity != null) {
            entity.delete();
        }
    }
}
