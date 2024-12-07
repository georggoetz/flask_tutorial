from flask import g
from sqlalchemy.sql import text
from sqlalchemy.exc import ProgrammingError


def test_init_db_command(runner, monkeypatch):
  class Recorder(object):
    called = False

  def fake_init_db():
    Recorder.called = True

  monkeypatch.setattr('flaskr.db.init_db', fake_init_db)

  result = runner.invoke(args=['init-db'])
  assert 'Initialized' in result.output
  assert Recorder.called
